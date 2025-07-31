
import { ArrowRight, Calendar, Mail, Linkedin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-elevate-dark text-white relative z-10">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Let's Eliminate Your Bottlenecks</h2>
            <p className="text-lg text-gray-300">
              Ready to uncover the top 2–3 things you can automate in your business this month? Book your free AI audit and let's build smarter systems — fast.
            </p>
            <div className="h-1 w-20 bg-elevate-accent mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-6 md:p-8 card-shadow">
            <div className="flex flex-col space-y-4">
              <a 
                href="https://calendly.com/raj-dalal-xlevatetech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-elevate-dark/50 border border-elevate-accent/20 rounded-lg transition-all hover:border-elevate-accent/40 hover:bg-elevate-dark/70"
              >
                <Calendar className="h-6 w-6 text-elevate-accent mr-4 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-semibold">Book Your Free Consultation</div>
                  <div className="text-sm text-gray-300">Schedule a 30-minute discovery call</div>
                </div>
                <ArrowRight className="h-5 w-5 text-elevate-accent flex-shrink-0" />
              </a>
              
              <a 
                href="mailto:raj.dalal@xlevatetech.com" 
                className="flex items-center p-4 bg-elevate-dark/50 border border-elevate-accent/20 rounded-lg transition-all hover:border-elevate-accent/40 hover:bg-elevate-dark/70"
              >
                <Mail className="h-6 w-6 text-elevate-accent mr-4 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-semibold">Email Raj</div>
                  <div className="text-sm text-gray-300">raj.dalal@xlevatetech.com</div>
                </div>
                <ArrowRight className="h-5 w-5 text-elevate-accent flex-shrink-0" />
              </a>
              
              <a 
                href="https://www.linkedin.com/in/rajdalal1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-elevate-dark/50 border border-elevate-accent/20 rounded-lg transition-all hover:border-elevate-accent/40 hover:bg-elevate-dark/70"
              >
                <Linkedin className="h-6 w-6 text-elevate-accent mr-4 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-semibold">Connect on LinkedIn</div>
                  <div className="text-sm text-gray-300">Let's grow our network</div>
                </div>
                <ArrowRight className="h-5 w-5 text-elevate-accent flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
