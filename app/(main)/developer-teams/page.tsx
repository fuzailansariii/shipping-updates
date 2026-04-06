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

const techStack = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Clerk", category: "Auth" },
  { name: "Razorpay", category: "Payments" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Drizzle ORM", category: "ORM" },
];

// TODO: Rebuild with scratch and fetch LinkedIn Account to show it.

export default function DeveloperTeamPage() {
  return (
    <Container>
      <div className="w-full md:max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Developer & Team
          </h1>
          <p className="text-lg text-muted-foreground font-nunito w-full md:max-w-2xl mx-auto">
            Built with passion, dedication, and a mission to help aspiring
            maritime professionals succeed.
          </p>
        </div>

        {/* Main Developer Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12 mt-4">
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
                <h2 className="text-3xl font-bold md:text-card-color text-primary-dark font-nunito">
                  Mohd Fuzail Ansari
                </h2>
                <p className="text-lg text-gray-600 font-nunito">
                  Solo Developer
                </p>
                <div className="flex items-center gap-2 mt-2 justify-center font-nunito sm:justify-start">
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
            <div className="mt-8 space-y-4 text-muted-foreground">
              <p>
                Hi! I'm the solo developer behind{" "}
                <strong>Shipping Updates</strong>. I built this platform from
                the ground up to make shipping exam preparation accessible and
                efficient.
              </p>
              <p>
                Every feature, design decision, and system architecture reflects
                my focus on performance, usability, and real-world value for
                students.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
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
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://github.com/fuzailansariii"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://www.linkedin.com/in/mohdfuzailansari/"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <FaLinkedinIn className="w-5 h-5" />
                  LinkedIn
                </Link>
              </Button>

              <Button size="lg" className="gap-2" variant={"secondary"} asChild>
                <Link href="mailto:fuzailansarisecret@gmail.com">
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* What I Do Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 font-nunito">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Full Stack Development
            </h3>
            <p className="text-muted-foreground">
              I build complete products - from UI/UX to backend architecture,
              authentication, payments, and deployment pipelines.
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Product Vision
            </h3>
            <p className="text-muted-foreground">
              I focus on building meaningful products by combining user
              experience, performance, and continuous iteration.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10 mb-12 font-nunito">
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
            {techStack.map((tech, idx) => (
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
        <div className="rounded-2xl p-10 text-center bg-linear-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Built with Purpose</h2>
          <p className="max-w-2xl mx-auto text-blue-100">
            Shipping Updates is more than a project - it's a mission to make
            quality maritime education accessible to everyone.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center font-nunito">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Let's Connect
          </h3>
          <p className="text-gray-600 mb-3 max-w-2xl mx-auto">
            Have questions, feedback, or just want to say hi? I'd love to hear
            from you!
          </p>
          <Button
            size="lg"
            className="gap-2 font-bold"
            variant={"outline"}
            asChild
          >
            <Link href="mailto:fuzailansarisecret@gmail.com">
              <Mail className="w-5 h-5" />
              Contact Me
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
