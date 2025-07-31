import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RSSItem {
  title: string;
  description?: string;
  link?: string;
  pubDate?: string;
  category?: string;
}

interface FeedHealth {
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  responseTime: number;
  totalItems: number;
  validItems: number;
  errorMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all active RSS feeds
    const { data: feeds, error: feedsError } = await supabaseClient
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true)

    if (feedsError) {
      throw feedsError
    }

    const results = []

    for (const feed of feeds || []) {
      const startTime = Date.now()
      let feedHealth: FeedHealth = {
        status: 'healthy',
        responseTime: 0,
        totalItems: 0,
        validItems: 0
      }

      try {
        console.log(`Processing feed: ${feed.name} - ${feed.url}`)
        
        // Fetch RSS feed with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await fetch(feed.url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Xlevate-RSS-Aggregator/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml'
          }
        })
        
        clearTimeout(timeoutId)
        feedHealth.responseTime = Date.now() - startTime

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const xmlText = await response.text()
        const items = parseRSSFeed(xmlText, feed.category)
        
        feedHealth.totalItems = items.length
        feedHealth.validItems = items.filter(item => item.title && item.title.trim().length > 0).length

        // Store valid items in cache
        for (const item of items) {
          if (item.title && item.title.trim().length > 0) {
            await supabaseClient
              .from('rss_content_cache')
              .upsert({
                feed_id: feed.id,
                title: item.title,
                description: item.description || '',
                link: item.link || '',
                pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                category: item.category || feed.category,
                cached_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
              }, {
                onConflict: 'feed_id,title'
              })
          }
        }

        // Determine feed health status
        if (feedHealth.validItems === 0) {
          feedHealth.status = 'warning'
        } else if (feedHealth.validItems < feedHealth.totalItems * 0.5) {
          feedHealth.status = 'warning'
        } else if (feedHealth.responseTime > 10000) {
          feedHealth.status = 'warning'
        }

        results.push({
          feedId: feed.id,
          feedName: feed.name,
          status: 'success',
          itemsProcessed: feedHealth.validItems,
          responseTime: feedHealth.responseTime
        })

      } catch (error) {
        console.error(`Error processing feed ${feed.name}:`, error)
        
        feedHealth.status = 'offline'
        feedHealth.errorMessage = error.message
        feedHealth.responseTime = Date.now() - startTime

        results.push({
          feedId: feed.id,
          feedName: feed.name,
          status: 'error',
          error: error.message,
          responseTime: feedHealth.responseTime
        })
      }

      // Update feed health
      await supabaseClient
        .from('rss_feed_health')
        .upsert({
          feed_id: feed.id,
          status: feedHealth.status,
          response_time_ms: feedHealth.responseTime,
          total_items: feedHealth.totalItems,
          valid_items: feedHealth.validItems,
          error_message: feedHealth.errorMessage,
          last_checked: new Date().toISOString(),
          uptime_percentage: feedHealth.status === 'offline' ? 0 : 
                           feedHealth.status === 'critical' ? 25 :
                           feedHealth.status === 'warning' ? 75 : 100
        }, {
          onConflict: 'feed_id'
        })
    }

    // Update automation workflow status
    await supabaseClient
      .from('automation_workflows')
      .update({
        last_run: new Date().toISOString(),
        next_run: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // Next run in 6 hours
        success_count: results.filter(r => r.status === 'success').length,
        error_count: results.filter(r => r.status === 'error').length
      })
      .eq('workflow_type', 'rss_aggregation')

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('RSS Aggregator Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function parseRSSFeed(xmlText: string, defaultCategory: string): RSSItem[] {
  const items: RSSItem[] = []
  
  try {
    // Simple XML parsing for RSS feeds
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi)
    
    if (itemMatches) {
      for (const itemXml of itemMatches) {
        const title = extractXMLContent(itemXml, 'title')
        const description = extractXMLContent(itemXml, 'description') || extractXMLContent(itemXml, 'summary')
        const link = extractXMLContent(itemXml, 'link')
        const pubDate = extractXMLContent(itemXml, 'pubDate') || extractXMLContent(itemXml, 'published')
        const category = extractXMLContent(itemXml, 'category') || defaultCategory

        if (title) {
          items.push({
            title: cleanText(title),
            description: description ? cleanText(description) : undefined,
            link: link || undefined,
            pubDate: pubDate || undefined,
            category: category || defaultCategory
          })
        }
      }
    }
  } catch (error) {
    console.error('Error parsing RSS XML:', error)
  }

  return items
}

function extractXMLContent(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : null
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // Remove CDATA
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}