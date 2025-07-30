import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, X } from "lucide-react";

interface ColorPickerProps {
  value?: string | null;
  onChange: (color: string | null) => void;
}

const CARD_COLORS = [
  { name: "Azul", value: "#3B82F6", bg: "bg-blue-500" },
  { name: "Verde", value: "#10B981", bg: "bg-emerald-500" },
  { name: "Rojo", value: "#EF4444", bg: "bg-red-500" },
  { name: "Amarillo", value: "#F59E0B", bg: "bg-yellow-500" },
  { name: "Púrpura", value: "#8B5CF6", bg: "bg-violet-500" },
  { name: "Rosa", value: "#EC4899", bg: "bg-pink-500" },
  { name: "Índigo", value: "#6366F1", bg: "bg-indigo-500" },
  { name: "Cian", value: "#06B6D4", bg: "bg-cyan-500" },
  { name: "Naranja", value: "#F97316", bg: "bg-orange-500" },
  { name: "Lima", value: "#84CC16", bg: "bg-lime-500" },
  { name: "Esmeralda", value: "#059669", bg: "bg-emerald-600" },
  { name: "Slate", value: "#64748B", bg: "bg-slate-500" },
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedColor = CARD_COLORS.find(color => color.value === value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-10"
        >
          {selectedColor ? (
            <>
              <div 
                className={`w-4 h-4 rounded ${selectedColor.bg}`}
              />
              <span>{selectedColor.name}</span>
            </>
          ) : (
            <>
              <Palette className="w-4 h-4" />
              <span>Seleccionar color</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Colores de tarjeta</h4>
          
          <div className="grid grid-cols-4 gap-2">
            {CARD_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  onChange(color.value);
                  setIsOpen(false);
                }}
                className={`
                  w-10 h-10 rounded-md border-2 transition-all hover:scale-110
                  ${color.bg}
                  ${value === color.value ? 'border-gray-800 shadow-md' : 'border-gray-300'}
                `}
                title={color.name}
              />
            ))}
          </div>

          {value && (
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="w-full justify-start gap-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
                Quitar color
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}