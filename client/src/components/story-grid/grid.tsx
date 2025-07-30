import { useQuery } from "@tanstack/react-query";
import { type Chapter, type Character, type Card } from "@shared/schema";
import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardEditorModal } from "./card-editor-modal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

interface CardData {
  characterId: string;
  chapterId: string;
  characterName: string;
  chapterTitle: string;
  existingCard?: Card;
}

function DraggableCard({ card, children }: { card: Card; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function DroppableCell({ 
  id, 
  children, 
  className 
}: { 
  id: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`${className} ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
    >
      {children}
    </div>
  );
}

export function StoryGridComponent() {
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const moveCardMutation = useMutation({
    mutationFn: ({ cardId, newChapterId, newCharacterId }: { cardId: string; newChapterId: string; newCharacterId: string }) =>
      apiRequest("PATCH", `/api/cards/${cardId}`, { 
        chapterId: newChapterId,
        characterId: newCharacterId 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Tarjeta movida exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al mover la tarjeta", variant: "destructive" });
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find(c => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const draggedCardId = active.id as string;
    const droppedCellId = over.id as string;
    
    // Parse the cell ID to get character and chapter IDs
    const [newCharacterId, newChapterId] = droppedCellId.split('-');
    
    const draggedCard = cards.find(c => c.id === draggedCardId);
    if (!draggedCard) return;

    // Check if the card is being moved to a different position
    if (draggedCard.characterId !== newCharacterId || draggedCard.chapterId !== newChapterId) {
      moveCardMutation.mutate({
        cardId: draggedCardId,
        newChapterId,
        newCharacterId
      });
    }
  };

  const getCharacterColor = (character: Character, index: number): string => {
    if (character.color) return character.color;
    const colors = [
      '#8B5CF6', // purple
      '#6366F1', // indigo  
      '#F43F5E', // rose
      '#06B6D4', // cyan
      '#10B981', // emerald
      '#F59E0B'  // amber
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

  const getCardBackgroundStyle = (color: string | null | undefined): React.CSSProperties => {
    if (!color) return {};
    
    // Lighten the color for background (add transparency)
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    return {
      backgroundColor: hexToRgba(color, 0.1),
      borderLeftWidth: '4px',
      borderLeftColor: color,
      borderLeftStyle: 'solid',
    };
  };

  const gridTemplateColumns = `200px repeat(${chapters.length}, 280px)`;

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: getCharacterColor(character, characterIndex) }}
                >
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
                <DroppableCell
                  key={`${character.id}-${chapter.id}`}
                  id={`${character.id}-${chapter.id}`}
                  className="border-r border-b border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors relative"
                >
                  {/* Timeline line */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 z-10"
                    style={{ backgroundColor: getCharacterColor(character, characterIndex) }}
                  />
                  
                  <div
                    onClick={() => setEditingCard({
                      characterId: character.id,
                      chapterId: chapter.id,
                      characterName: character.name,
                      chapterTitle: chapter.title,
                      existingCard: card
                    })}
                  >
                    {card ? (
                      <DraggableCard card={card}>
                        <div 
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full min-h-[120px] hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                          style={getCardBackgroundStyle(card.color)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            {card.tag && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(card.tag)}`}>
                                {card.tag.charAt(0).toUpperCase() + card.tag.slice(1)}
                              </span>
                            )}
                          </div>
                          {card.content && (
                            <p className="text-sm leading-relaxed text-gray-700">
                              {card.content}
                            </p>
                          )}
                        </div>
                      </DraggableCard>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 h-full min-h-[120px] flex items-center justify-center hover:border-gray-400 transition-colors">
                        <div className="text-center text-gray-500">
                          <PlusCircle size={24} className="mx-auto mb-2" />
                          <p className="text-sm">Agregar contenido</p>
                        </div>
                      </div>
                    )}
                  </div>
                </DroppableCell>
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
      
      <DragOverlay>
        {activeCard ? (
          <div 
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-h-[120px] opacity-90 transform rotate-3"
            style={getCardBackgroundStyle(activeCard.color)}
          >
            <div className="flex items-start justify-between mb-2">
              {activeCard.tag && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(activeCard.tag)}`}>
                  {activeCard.tag.charAt(0).toUpperCase() + activeCard.tag.slice(1)}
                </span>
              )}
            </div>
            {activeCard.content && (
              <p className="text-sm leading-relaxed text-gray-700">
                {activeCard.content}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
