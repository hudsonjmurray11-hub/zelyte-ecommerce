import React from 'react'
import zelyteCoconut from '/Zelyte_COCONUT.webp';
import { ArrowRight, Zap, Users, Target, Check, Star, Trophy, BookOpen } from 'lucide-react';

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="inline-block">REINVENTING</span>{' '}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                HYDRATION
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
              The future of electrolyte hydration is here. Pure, powerful, and perfectly portable.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              The Problem with Hydration
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Traditional hydration solutions are failing us. Powders clump, drinks spill, and both are loaded with artificial ingredients that do more harm than good.
            </p>
            <p className="text-xl text-gray-600 mb-8">
              Athletes, students, and active people everywhere are dehydrated, underperforming, and settling for subpar solutions that don't match their lifestyle.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Messy Powders</h3>
                <p className="text-gray-600">Clumpy, hard to measure, and impossible to use on-the-go</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Heavy Drinks</h3>
                <p className="text-gray-600">Bulky bottles that spill, break, and weigh you down</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Artificial Ingredients</h3>
                <p className="text-gray-600">Chemicals and preservatives that your body doesn't need</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                The Solution: Zelyte
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Revolutionary electrolyte tins that deliver pure, powerful hydration anywhere, anytime. 
                Each tin contains 15 servings of premium electrolytes with zero artificial ingredients.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Simply add water, shake, and experience hydration reimagined. Lightweight, portable, 
                and designed for the modern active lifestyle.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">15 servings per tin</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Zero artificial ingredients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Lightweight & portable</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">4 delicious flavors</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20"></div>
              <img 
                src={zelyteCoconut}
                alt="Zelyte Tin"
                className="relative w-96 h-96 object-contain mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Zelyte Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Zelyte Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Science-backed hydration that actually works for your lifestyle
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-2xl bg-blue-50">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Hydration</h3>
              <p className="text-gray-600">Fast-absorbing electrolytes that your body can use immediately</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-green-50">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Precision Formulation</h3>
              <p className="text-gray-600">Perfect balance of electrolytes optimized for peak performance</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-purple-50">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Natural & Clean</h3>
              <p className="text-gray-600">Pure ingredients with no artificial colors, flavors, or preservatives</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Zelyte vs. Traditional Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-blue-600">Zelyte Tins</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-600">Traditional Drinks</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-600">Powders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">Portability</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-500">❌</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-500">❌</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">Clean Ingredients</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-500">❌</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-yellow-500">⚠️</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">No Mess</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-yellow-500">⚠️</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-500">❌</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">Value for Money</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-500">❌</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-yellow-500">⚠️</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Who It's For
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Zelyte is designed for anyone who demands peak performance from their body
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Athletes</h3>
              <p className="text-white/90">
                Professional and amateur athletes who need reliable hydration for training, 
                competition, and recovery. Fuel your performance with precision.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Students</h3>
              <p className="text-white/90">
                Busy students juggling classes, studying, and activities. Stay hydrated 
                and focused without the hassle of bulky drinks or messy powders.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Active individuals</h3>
              <p className="text-white/90">
                Anyone with an active lifestyle who values convenience, quality, and 
                natural ingredients. From hiking to commuting, Zelyte fits your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section id="meet-the-team" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind Zelyte's mission to revolutionize hydration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">HM</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hudson Murray</h3>
              <p className="text-lg font-semibold text-blue-600 mb-4">Founder</p>
              <a 
                href="https://www.linkedin.com/in/hudson-murray-025989320/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
                LinkedIn
              </a>
              <p className="text-gray-600">
                Entrepreneur and athlete with a vision to solve the hydration problem. 
                Hudson combines his passion for sports with business acumen to build 
                Zelyte into the future of electrolyte hydration.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">TK</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thaddeus Krimendahl</h3>
              <p className="text-lg font-semibold text-purple-600 mb-4">Marketing</p>
              <a 
                href="https://www.linkedin.com/in/thaddeus-krimendahl-b5a024265/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
                LinkedIn
              </a>
              <p className="text-gray-600">
                Creative strategist who builds Zelyte's community and brand presence. 
                Teddy connects with athletes and active people to share the Zelyte story 
                and build lasting relationships with our customers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">BP</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Brianna Pease</h3>
              <p className="text-lg font-semibold text-green-600 mb-4">Legal & Operations</p>
              <a 
                href="https://www.linkedin.com/in/brianna-pease-597848357/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
                LinkedIn
              </a>
              <p className="text-gray-600">
                Legal expert who manages agreements, trademarks, and compliance. 
                Brianna ensures Zelyte operates with integrity and protects our 
                intellectual property as we scale globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Future Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Vision & Future
          </h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8">
            Zelyte is more than just a product – we're building a global lifestyle brand that 
            empowers people to perform at their best, wherever life takes them.
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            We envision a world where hydration is effortless, natural, and accessible to everyone. 
            Our mission extends beyond electrolytes to creating a community of high performers who 
            refuse to settle for anything less than excellence.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join the Zelyte Revolution
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to experience hydration reimagined? Join thousands of athletes, students, 
            and active people who have already made the switch to Zelyte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#purchase"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Shop Zelyte Now</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#testimonials"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Read Success Stories
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Join the Zelyte Club • Free shipping on orders over $50 • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
