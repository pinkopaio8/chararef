import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, FileText, Users, Image as ImageIcon, Copyright } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service and Legal Notices</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <div className="text-center mb-8">
            <FileText className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service and Legal Notices</h2>
            <p className="text-gray-600">
              Please read these terms carefully before using CharaRef. This is a fan-made project for educational and reference purposes.
            </p>
          </div>

          {/* Copyright Section */}
          <div className="border-l-4 border-purple-600 pl-6">
            <div className="flex items-center mb-3">
              <Copyright className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Copyright and Intellectual Property</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              All anime characters, images, and content displayed on this site are property of their respective authors and copyright holders. CharaRef does not claim ownership of any copyrighted material. This is a fan-made project created for educational and reference purposes only.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All trademarks, service marks, and trade names are the property of their respective owners. These materials are used without permission but in compliance with fair use principles.
            </p>
          </div>

          {/* Personal Use Section */}
          <div className="border-l-4 border-purple-600 pl-6">
            <div className="flex items-center mb-3">
              <Users className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Personal and Non-Commercial Use</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              This website was created exclusively for personal, educational, and reference purposes. All content is provided "as is" without any warranty. CharaRef is a non-profit project and does not generate any form of revenue.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Users may access and use the content for personal reference and educational purposes. Commercial use of any content from this site is strictly prohibited without explicit permission from the copyright holders.
            </p>
          </div>

          {/* Fair Use Section */}
          <div className="border-l-4 border-purple-600 pl-6">
            <div className="flex items-center mb-3">
              <Shield className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Fair Use Doctrine</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              The use of copyrighted images and material on this site falls under the "fair use" doctrine as provided for in copyright legislation. Images are used for purposes of reference, criticism, commentary, and research, without affecting the potential market for the original work.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Factors considered in fair use analysis include: the purpose and character of the use, the nature of the copyrighted work, the amount used, and the effect on the potential market. This project uses minimal necessary portions for transformative purposes.
            </p>
          </div>

          {/* User Responsibility Section */}
          <div className="border-l-4 border-purple-600 pl-6">
            <div className="flex items-center mb-3">
              <Users className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">User Responsibility</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users are responsible for the material they upload. By uploading content to CharaRef, users declare that they have the necessary rights to share such materials or that their use falls within fair use exceptions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Users agree not to upload content that violates copyright laws, contains inappropriate material, or infringes on the rights of others. CharaRef reserves the right to moderate and remove content that violates these terms.
            </p>
          </div>

          {/* Content Removal Section */}
          <div className="border-l-4 border-purple-600 pl-6">
            <div className="flex items-center mb-3">
              <ImageIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Content Removal</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a copyright holder and believe that your material has been used improperly, please contact us for immediate content removal. We are committed to respecting intellectual property rights and will promptly address any valid claims.
            </p>
            <p className="text-gray-700 leading-relaxed">
              To submit a removal request, please provide: proof of copyright ownership, identification of the infringing material, and a statement of good faith belief that the use is unauthorized. We will respond to all legitimate requests within 24-48 hours.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Disclaimer</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              CharaRef is an unofficial fan-made website and is not affiliated with, endorsed by, or connected to any animation studio, publisher, or copyright holder. All content is provided for educational and reference purposes only.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The creators of CharaRef are not responsible for any misuse of the content provided on this site. Users are solely responsible for how they use the information and resources available on this platform.
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-600 mb-4">
              For copyright inquiries, removal requests, or questions about these terms, please contact us through our moderation system.
            </p>
            <Link href="/login">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Contact Moderators
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2024 CharaRef. This is a fan-made project not affiliated with any animation studio or rights holder.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}