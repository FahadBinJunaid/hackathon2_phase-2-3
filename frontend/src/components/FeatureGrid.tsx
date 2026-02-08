/**
 * Feature Grid Component
 * Feature: 004-ui-refinement
 * User Story: US1 - Landing Page Experience
 */

export default function FeatureGrid() {
  const features = [
    {
      title: 'Task Management',
      description: 'Create, organize, and track your tasks efficiently',
      icon: '✓',
    },
    {
      title: 'Secure Data',
      description: 'Your data is protected with industry-standard encryption',
      icon: '🔒',
    },
    {
      title: 'Responsive Design',
      description: 'Works seamlessly on desktop, tablet, and mobile devices',
      icon: '📱',
    },
  ];

  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="text-slate-100">Why Choose </span>
          <span className="text-teal-400">Todo App?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-lg hover:border-teal-500/50 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-200">
                {feature.title}
              </h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
