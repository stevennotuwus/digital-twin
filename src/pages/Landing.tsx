import { Activity, TrendingUp, Shield, Zap, BarChart3, Globe, ArrowRight, Check } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Monitor your IoT devices in real-time with instant updates and live data streams'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive performance metrics and historical data analysis for informed decisions'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with end-to-end encryption and user authentication'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized infrastructure for millisecond-level latency and instant responsiveness'
    },
    {
      icon: TrendingUp,
      title: 'Scalable',
      description: 'Handle thousands of devices seamlessly with our cloud-native architecture'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your dashboard from anywhere with responsive design and cloud sync'
    }
  ];

  const stats = [
    { value: '99.8%', label: 'Uptime' },
    { value: '50ms', label: 'Avg Latency' },
    { value: '10K+', label: 'Active Devices' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Digital Twin</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              IoT Device Management <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Reimagined</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Monitor, control, and optimize your IoT infrastructure with real-time analytics, intelligent automation, and enterprise-grade security.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all shadow-2xl shadow-blue-500/30 text-lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-500/40 group-hover:to-cyan-400/40 transition-all">
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Why Choose Digital Twin?</h2>
                <div className="space-y-4">
                  {[
                    'Real-time device monitoring and control',
                    'Advanced predictive analytics',
                    'Automated alert and notification system',
                    'Multi-tenant architecture with isolation',
                    'Industry-leading 99.8% uptime SLA',
                    'Dedicated 24/7 customer support'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-xl p-8 border border-white/10">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Total Devices</div>
                    <div className="text-3xl font-bold text-cyan-300">10,547</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">System Uptime</div>
                    <div className="text-3xl font-bold text-green-400">99.8%</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Data Points/Hour</div>
                    <div className="text-3xl font-bold text-blue-400">2.3M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-300 transition">Features</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-300 transition">About</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-300 transition">Docs</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">API Reference</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-300 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex items-center justify-between text-gray-400">
            <p>&copy; 2024 Digital Twin. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-cyan-300 transition">Twitter</a>
              <a href="#" className="hover:text-cyan-300 transition">GitHub</a>
              <a href="#" className="hover:text-cyan-300 transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
