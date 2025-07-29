import { useQuery } from "@tanstack/react-query";
import { type Chapter, type Character, type Card } from "@shared/schema";
import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardEditorModal } from "./card-editor-modal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CardData {
  characterId: string;
  chapterId: string;
  characterName: string;
  chapterTitle: string;
  existingCard?: Card;
}

export function StoryGridComponent() {
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const { toast } = useToast();

  const { data: chapters = [], isLoading: chaptersLoading } = useQuery<Chapter[]>({
    queryKey: ["/api/chapters"],
  });

  const { data: characters = [], isLoading: charactersLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { data: cards = [], isLoading: cardsLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const deleteChapterMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/chapters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Capítulo eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar capítulo", variant: "destructive" });
    }
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/characters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Personaje eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar personaje", variant: "destructive" });
    }
  });

  if (chaptersLoading || charactersLoading || cardsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  const getCard = (characterId: string, chapterId: string): Card | undefined => {
    return cards.find(card => card.characterId === characterId && card.chapterId === chapterId);
  };

  const getCharacterInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCharacterColor = (index: number): string => {
    const colors = [
      'bg-purple-100 text-purple-600',
      'bg-indigo-100 text-indigo-600',
      'bg-rose-100 text-rose-600',
      'bg-cyan-100 text-cyan-600',
      'bg-emerald-100 text-emerald-600',
      'bg-amber-100 text-amber-600'
    ];
    return colors[index % colors.length];
  };

  const getTagColor = (tag: string): string => {
    const tagColors: Record<string, string> = {
      'introducción': 'bg-blue-100 text-blue-800',
      'conflicto': 'bg-red-100 text-red-800',
      'desarrollo': 'bg-yellow-100 text-yellow-800',
      'clímax': 'bg-orange-100 text-orange-800',
      'resolución': 'bg-green-100 text-green-800',
      'apoyo': 'bg-blue-100 text-blue-800',
      'revelación': 'bg-teal-100 text-teal-800',
      'sacrificio': 'bg-red-100 text-red-800',
      'legado': 'bg-emerald-100 text-emerald-800',
      'sombra': 'bg-gray-100 text-gray-800',
      'manipulación': 'bg-amber-100 text-amber-800',
      'confrontación': 'bg-red-100 text-red-800',
      'derrota': 'bg-slate-100 text-slate-800',
      'guía': 'bg-purple-100 text-purple-800',
      'apoyo-técnico': 'bg-green-100 text-green-800'
    };
    return tagColors[tag] || 'bg-gray-100 text-gray-800';
  };

  const gridTemplateColumns = `200px repeat(${chapters.length}, 280px)`;

  return (
    <div className="min-w-full">
      <div 
        className="grid-container"
        style={{ 
          display: 'grid', 
          gridTemplateColumns, 
          minHeight: 'calc(100vh - 180px)' 
        }}
      >
        {/* Top-left corner cell */}
        <div className="sticky top-0 left-0 z-20 bg-gray-100 border-r border-b border-gray-300 p-4 flex items-center justify-center font-semibold text-gray-700">
          Personajes / Capítulos
        </div>

        {/* Chapter Headers */}
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="sticky top-0 z-10 bg-white border-r border-b border-gray-300 p-4 flex items-center justify-between group hover:bg-gray-50"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
              {chapter.description && (
                <p className="text-xs text-gray-500 mt-1">{chapter.description}</p>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 p-1"
                onClick={() => deleteChapterMutation.mutate(chapter.id)}
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        ))}

        {/* Character Rows with Cards */}
        {characters.map((character, characterIndex) => (
          <div key={character.id} className="contents">
            {/* Character Header */}
            <div className="sticky left-0 z-10 bg-gray-50 border-r border-b border-gray-300 p-4 flex items-center justify-between group hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCharacterColor(characterIndex)}`}>
                  <span className="text-sm font-semibold">
                    {getCharacterInitials(character.name)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{character.name}</h4>
                  {character.role && (
                    <p className="text-xs text-gray-500">{character.role}</p>
                  )}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-500 p-1"
                  onClick={() => deleteCharacterMutation.mutate(character.id)}
                >
                  <X size={12} />
                </Button>
              </div>
            </div>

            {/* Character Cards for each Chapter */}
            {chapters.map((chapter) => {
              const card = getCard(character.id, chapter.id);
              
              return (
                <div
                  key={`${character.id}-${chapter.id}`}
                  className="border-r border-b border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setEditingCard({
                    characterId: character.id,
                    chapterId: chapter.id,
                    characterName: character.name,
                    chapterTitle: chapter.title,
                    existingCard: card
                  })}
                >
                  {card ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full min-h-[120px] hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        {card.tag && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(card.tag)}`}>
                            {card.tag.charAt(0).toUpperCase() + card.tag.slice(1)}
                          </span>
                        )}
                      </div>
                      {card.content && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {card.content}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 h-full min-h-[120px] flex items-center justify-center hover:border-gray-400 transition-colors">
                      <div className="text-center text-gray-500">
                        <PlusCircle size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Agregar contenido</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <CardEditorModal
        isOpen={!!editingCard}
        cardData={editingCard}
        onClose={() => setEditingCard(null)}
      />
    </div>
  );
}
