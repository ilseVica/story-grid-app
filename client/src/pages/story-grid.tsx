import { BookOpen, Save, Share, Plus, UserPlus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryGridComponent } from "@/components/story-grid/grid";
import { useState } from "react";
import { AddChapterModal } from "@/components/story-grid/add-chapter-modal";
import { AddCharacterModal } from "@/components/story-grid/add-character-modal";

export default function StoryGrid() {
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [isAddCharacterOpen, setIsAddCharacterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-plottr-bg font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <BookOpen className="text-plottr-blue mr-2" size={24} />
              Story Grid
            </h1>
            <span className="text-sm text-gray-500">Mi Historia.story</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-700">
              <Save className="mr-2" size={16} />
              Guardar
            </Button>
            <Button className="bg-plottr-blue hover:bg-blue-600">
              <Share className="mr-2" size={16} />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsAddChapterOpen(true)}
              className="bg-blue-50 text-plottr-blue hover:bg-blue-100 border-0"
              variant="outline"
            >
              <Plus className="mr-2" size={16} />
              Agregar Capítulo
            </Button>
            <Button
              onClick={() => setIsAddCharacterOpen(true)}
              className="bg-green-50 text-green-600 hover:bg-green-100 border-0"
              variant="outline"
            >
              <UserPlus className="mr-2" size={16} />
              Agregar Personaje
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Info size={16} />
            <span>Haz clic en cualquier celda para agregar o editar contenido</span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto">
        <StoryGridComponent />
      </div>

      <AddChapterModal
        isOpen={isAddChapterOpen}
        onClose={() => setIsAddChapterOpen(false)}
      />

      <AddCharacterModal
        isOpen={isAddCharacterOpen}
        onClose={() => setIsAddCharacterOpen(false)}
      />
    </div>
  );
}
