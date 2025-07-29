import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Card } from "@shared/schema";

interface CardData {
  characterId: string;
  chapterId: string;
  characterName: string;
  chapterTitle: string;
  existingCard?: Card;
}

interface CardEditorModalProps {
  isOpen: boolean;
  cardData: CardData | null;
  onClose: () => void;
}

export function CardEditorModal({ isOpen, cardData, onClose }: CardEditorModalProps) {
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (cardData?.existingCard) {
      setTag(cardData.existingCard.tag || "");
      setContent(cardData.existingCard.content || "");
    } else {
      setTag("");
      setContent("");
    }
  }, [cardData]);

  const createCardMutation = useMutation({
    mutationFn: (data: { characterId: string; chapterId: string; content: string; tag: string }) =>
      apiRequest("POST", "/api/cards", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Tarjeta creada exitosamente" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error al crear tarjeta", variant: "destructive" });
    }
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { content: string; tag: string } }) =>
      apiRequest("PUT", `/api/cards/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({ title: "Tarjeta actualizada exitosamente" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error al actualizar tarjeta", variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (!cardData) return;

    const data = {
      content,
      tag,
    };

    if (cardData.existingCard) {
      updateCardMutation.mutate({
        id: cardData.existingCard.id,
        data
      });
    } else {
      createCardMutation.mutate({
        characterId: cardData.characterId,
        chapterId: cardData.chapterId,
        ...data
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Contenido del Personaje</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="characterName">Personaje</Label>
            <Input
              id="characterName"
              value={cardData?.characterName || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="chapterName">Capítulo</Label>
            <Input
              id="chapterName"
              value={cardData?.chapterTitle || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="cardTag">Etiqueta</Label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="introducción">Introducción</SelectItem>
                <SelectItem value="conflicto">Conflicto</SelectItem>
                <SelectItem value="desarrollo">Desarrollo</SelectItem>
                <SelectItem value="clímax">Clímax</SelectItem>
                <SelectItem value="resolución">Resolución</SelectItem>
                <SelectItem value="apoyo">Apoyo</SelectItem>
                <SelectItem value="revelación">Revelación</SelectItem>
                <SelectItem value="sacrificio">Sacrificio</SelectItem>
                <SelectItem value="legado">Legado</SelectItem>
                <SelectItem value="sombra">Sombra</SelectItem>
                <SelectItem value="manipulación">Manipulación</SelectItem>
                <SelectItem value="confrontación">Confrontación</SelectItem>
                <SelectItem value="derrota">Derrota</SelectItem>
                <SelectItem value="guía">Guía</SelectItem>
                <SelectItem value="apoyo-técnico">Apoyo Técnico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="cardContent">Propósito del Personaje</Label>
            <Textarea
              id="cardContent"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe el propósito y rol del personaje en este capítulo..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={createCardMutation.isPending || updateCardMutation.isPending}
            className="bg-plottr-blue hover:bg-blue-600"
          >
            {createCardMutation.isPending || updateCardMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
