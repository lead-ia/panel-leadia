import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { AiPreferences, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function AiPreferencesSection() {
  const { dbUser, updateSettings } = useUser();
  if (!dbUser) {
    return <></>;
  }

  const defaultAiPreferences: AiPreferences = {
    initialQuestion: "Olá! Como posso ajudar você hoje?",
    tone: "Acolhedor",
    empathyLevel: "Empatia moderada (recomendado)",
    forbiddenTopics: [],
    clinicalResponse:
      "Entendo sua dúvida. Como sou uma assistente virtual, não posso realizar diagnósticos ou prescrever tratamentos. Recomendo agendar uma consulta para que possamos avaliar seu caso detalhadamente.",
  };

  const data = dbUser?.settings?.aiPreferences || defaultAiPreferences;

  const [localData, setLocalData] = useState<AiPreferences>(data);

  useEffect(() => {
    if (dbUser?.settings?.aiPreferences) {
      setLocalData(dbUser.settings.aiPreferences);
    }
  }, [dbUser?.settings?.aiPreferences]);

  const debouncedUpdate = useDebouncedCallback((updatedData: AiPreferences) => {
    updateSettings({
      aiPreferences: updatedData,
    });
  }, 1000);

  if (!localData) return null;

  const handleChange = (field: keyof AiPreferences, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const toggleForbiddenTopic = (topic: string) => {
    const currentTopics = localData.forbiddenTopics || [];
    const newTopics = currentTopics.includes(topic)
      ? currentTopics.filter((t) => t !== topic)
      : [...currentTopics, topic];
    handleChange("forbiddenTopics", newTopics);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Pergunta inicial personalizada
        </label>
        <input
          type="text"
          value={localData.initialQuestion}
          onChange={(e) => handleChange("initialQuestion", e.target.value)}
          placeholder="Ex: Poderia me contar o motivo da consulta?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">Tom desejado</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Acolhedor",
            "Formal",
            "Minimalista",
            "Técnico e objetivo",
            "Humanizado com empatia",
          ].map((tom) => (
            <label
              key={tom}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="tom"
                checked={localData.tone === tom}
                onChange={() => handleChange("tone", tom)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{tom}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Nível de personalização do acolhimento
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="empatia"
              checked={
                localData.empathyLevel === "Empatia moderada (recomendado)"
              }
              onChange={() =>
                handleChange("empathyLevel", "Empatia moderada (recomendado)")
              }
              className="text-[#6eb5d8]"
            />
            <span className="text-sm">Empatia moderada (recomendado)</span>
          </label>
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="empatia"
              checked={
                localData.empathyLevel ===
                "Alta empatia (Psiquiatria, Ginecologia, etc.)"
              }
              onChange={() =>
                handleChange(
                  "empathyLevel",
                  "Alta empatia (Psiquiatria, Ginecologia, etc.)",
                )
              }
              className="text-[#6eb5d8]"
            />
            <span className="text-sm">
              Alta empatia (Psiquiatria, Ginecologia, etc.)
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Assuntos proibidos para a IA
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Por segurança, marque os tópicos que a IA NUNCA deve abordar:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Diagnóstico",
            "Exames",
            "Medicamentos",
            "Ajuste de doses",
            "Classificação de gravidade",
            "Comentários sobre laudos",
            "Questões emocionais sensíveis",
          ].map((assunto) => (
            <label
              key={assunto}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localData.forbiddenTopics?.includes(assunto)}
                onChange={() => toggleForbiddenTopic(assunto)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{assunto}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Resposta padrão quando paciente faz perguntas clínicas
        </label>
        <textarea
          rows={3}
          value={localData.clinicalResponse}
          onChange={(e) => handleChange("clinicalResponse", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>
    </div>
  );
}
