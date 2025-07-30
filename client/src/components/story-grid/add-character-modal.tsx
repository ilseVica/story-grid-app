import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Character } from "@shared/schema";
import { ColorPicker } from "@/components/ui/color-picker";

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCharacterModal({ isOpen, onClose }: AddCharacterModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const createCharacterMutation = useMutation({
    mutationFn: (data: { name: string; role: string; order: string; color?: string | null }) =>
      apiRequest("POST", "/api/characters", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      toast({ title: "Personaje creado exitosamente" });
      setName("");
      setRole("");
      setColor(null);
      onClose();
    },
    onError: () => {
      toast({ title: "Error al crear personaje", variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "El nombre es requerido", variant: "destructive" });
      return;
    }

    const nextOrder = (characters.length + 1).toString();

    createCharacterMutation.mutate({
      name: name.trim(),
      role: role.trim(),
      order: nextOrder,
      color: color
    });
  };

  const handleClose = () => {
    setName("");
    setRole("");
    setColor(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Personaje</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="characterName">Nombre del Personaje</Label>
            <Input
              id="characterName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Ana, Marcus, Elena, etc."
            />
          </div>
          
          <div>
            <Label htmlFor="characterRole">Rol (Opcional)</Label>
            <Input
              id="characterRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ej. Protagonista, Antagonista, Mentor, etc."
            />
          </div>
          
          <div>
            <Label>Color del Personaje (Opcional)</Label>
            <ColorPicker 
              value={color} 
              onChange={setColor}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={createCharacterMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {createCharacterMutation.isPending ? "Creando..." : "Crear Personaje"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
