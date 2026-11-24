import { ShieldCheck, User, Mail, Globe } from "lucide-react";

export function BusinessDetails() {
  return (
    <section className="panel p-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-[#edf2fb] mb-4">About us</h2>
      <div className="space-y-4 text-sm text-[#c1ccdc]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="shrink-0 w-5 h-5 text-[#65e6bd]" />
          <div>
            <p className="font-semibold text-[#edf2fb]">OS Resource Monitoring Ltd</p>
            <p>123 Monitoring Lane, Server City, SC 12345</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="shrink-0 w-5 h-5 text-[#65e6bd]" />
          <div>
            <p className="font-semibold text-[#edf2fb]">Contact</p>
            <p>
              <a href="mailto:support@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
                support@os-resource-monitoring.example.com
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="shrink-0 w-5 h-5 text-[#65e6bd]" />
          <div>
            <p className="font-semibold text-[#edf2fb]">Registration</p>
            <p>OSM-2026-0001</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BusinessDetails;
