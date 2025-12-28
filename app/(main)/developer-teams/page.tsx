import Container from "@/components/container";
import { Code2, Rocket, Heart, Zap, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export const metadata = {
  title: "Developer & Team | Shipping Updates",
  description:
    "Meet the developer behind Shipping Updates - built from scratch with passion for maritime education.",
};

// TODO: Rebuild with scratch and fetch LinkedIn Account to show it.

export default function DeveloperTeamPage() {
  return (
    <Container>
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Developer & Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with passion, dedication, and a mission to help aspiring
            maritime professionals succeed.
          </p>
        </div>

        {/* Main Developer Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 h-32" />

          <div className="px-8 sm:px-12 pb-10">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Code2 className="w-16 h-16 text-white" />
                </div>
              </div>

              {/* Name and Role */}
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h2 className="text-3xl font-bold md:text-card-color text-primary-dark">
                  Mohd Fuzail Ansari
                </h2>
                <p className="text-lg text-gray-600">
                  Founder & Solo Developer
                </p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Full Stack Developer
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Built from Scratch
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Hi! I'm the solo developer behind{" "}
                <strong>Shipping Updates</strong>. I built this entire platform
                from the ground up with a vision to make quality shipping exam
                preparation materials accessible to everyone.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Every line of code, every feature, and every design decision has
                been carefully crafted to provide the best learning experience
                for aspiring maritime professionals. This project represents my
                commitment to education and technology coming together.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">1</div>
                <div className="text-sm text-gray-600 mt-1">Developer</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">
                  Built from Scratch
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">∞</div>
                <div className="text-sm text-gray-600 mt-1">Dedication</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">24/7</div>
                <div className="text-sm text-gray-600 mt-1">
                  Support Mindset
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 items-center"
              >
                <FaGithub className="w-5 h-5" />
                GitHub
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 items-center"
              >
                <FaLinkedinIn className="w-5 h-5" />
                LinkedIn
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* What I Do Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Full Stack Development
            </h3>
            <p className="text-gray-700 leading-relaxed">
              I handle everything from frontend design to backend
              infrastructure, database management, payment integration, and
              deployment. Every aspect of Shipping Updates is built and
              maintained by me.
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Product Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Beyond coding, I shape the product strategy, user experience, and
              content direction. I'm constantly iterating based on user feedback
              to make this the best platform possible.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Tech Stack</h2>
          </div>

          <p className="text-gray-700 mb-6">
            Built with modern, scalable technologies to ensure the best
            performance and user experience:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Next.js", category: "Framework" },
              { name: "React", category: "Frontend" },
              { name: "TypeScript", category: "Language" },
              { name: "Tailwind CSS", category: "Styling" },
              { name: "Clerk", category: "Authentication" },
              { name: "Razorpay", category: "Payments" },
              { name: "PostgreSQL", category: "Database" },
              { name: "Prisma", category: "ORM" },
              { name: "Resend", category: "Emails" },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <div className="font-semibold text-gray-900">{tech.name}</div>
                  <div className="text-sm text-gray-600">{tech.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-white text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Built with Purpose</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Shipping Updates isn't just a project—it's a mission to democratize
            access to quality maritime education. Every feature is designed with
            students in mind, because I believe everyone deserves the tools to
            succeed.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Let's Connect
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions, feedback, or just want to say hi? I'd love to hear
            from you!
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Mail className="w-5 h-5" />
              Contact Me
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
