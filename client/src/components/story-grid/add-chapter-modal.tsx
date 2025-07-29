import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Chapter } from "@shared/schema";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddChapterModal({ isOpen, onClose }: AddChapterModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/chapters"],
  });

  const createChapterMutation = useMutation({
    mutationFn: (data: { title: string; description: string; order: string }) =>
      apiRequest("POST", "/api/chapters", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      toast({ title: "Capítulo creado exitosamente" });
      setTitle("");
      setDescription("");
      onClose();
    },
    onError: () => {
      toast({ title: "Error al crear capítulo", variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "El título es requerido", variant: "destructive" });
      return;
    }

    const nextOrder = (chapters.length + 1).toString();

    createChapterMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      order: nextOrder
    });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Capítulo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="chapterTitle">Título del Capítulo</Label>
            <Input
              id="chapterTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej. Capítulo 1, El Comienzo, etc."
            />
          </div>
          
          <div>
            <Label htmlFor="chapterDescription">Descripción (Opcional)</Label>
            <Textarea
              id="chapterDescription"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del capítulo..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={createChapterMutation.isPending}
            className="bg-plottr-blue hover:bg-blue-600"
          >
            {createChapterMutation.isPending ? "Creando..." : "Crear Capítulo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
