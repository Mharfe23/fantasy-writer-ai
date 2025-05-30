
import { Card } from "@/components/ui/card";
import type { Book } from "@/pages/Book";

interface BookPreviewProps {
  book: Book;
}

export function BookPreview({ book }: BookPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Book cover */}
      <div className="mb-8">
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 shadow-lg">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600">by {book.author}</p>
            <div className="w-24 h-1 bg-gray-400 mx-auto rounded"></div>
          </div>
        </Card>
      </div>
      
      {/* Book pages */}
      <div className="space-y-8">
        {book.paragraphs.map((paragraph, index) => (
          <Card key={paragraph.id} className="p-8 shadow-lg bg-white border-l-4 border-l-blue-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Text content */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-blue-600 mb-2">
                  Chapter {index + 1}
                </div>
                <p className="text-lg leading-relaxed text-gray-800 font-serif">
                  {paragraph.text}
                </p>
              </div>
              
              {/* Image */}
              <div className="flex justify-center">
                {paragraph.imageUrl ? (
                  <div className="relative">
                    <img
                      src={paragraph.imageUrl}
                      alt={`Illustration for chapter ${index + 1}`}
                      className="w-full max-w-sm rounded-lg shadow-md border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-200 rounded-lg -z-10"></div>
                  </div>
                ) : (
                  <div className="w-full max-w-sm h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-sm">No image generated</p>
                      <p className="text-xs">Generate an image in the editor</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Page decoration */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-400">
                {index + 1}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Book end */}
      <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 shadow-lg mt-8">
        <div className="text-center space-y-2">
          <div className="w-24 h-1 bg-gray-400 mx-auto rounded mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">The End</p>
          <p className="text-sm text-gray-500">Created with AI Book Creator</p>
        </div>
      </Card>
    </div>
  );
}
