"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AppLocale } from "@/lib/i18n";
import {
  projectMatchesSpecialtyRef,
  specialties,
  type SpecialtyDefinition,
} from "@/lib/specialties";
import { useCalculatorStore } from "@/providers/calculator-store-provider";
import { useFortyTwoStore } from "@/providers/forty-two-store-provider";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { track } from "@vercel/analytics";

export function AddProject({ locale }: { locale: AppLocale }) {
  const [open, setOpen] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(
    specialties[0]?.id ?? "",
  );
  const [, setValue] = useState("");
  const { addProject, entries } = useCalculatorStore((state) => state);
  let { projects } = useFortyTwoStore((state) => state);

  const rootProjects = Object.values(projects).filter((project) => !project.parentId);

  const addSpecialtyProjects = (specialty: SpecialtyDefinition) => {
    if (!specialty) {
      return;
    }

    const existingProjectIds = new Set(
      Object.values(entries).map((entry) => entry.project.id),
    );
    const refs = specialty.projectRefs;
    const matchedProjects = rootProjects.filter((project) =>
      refs.some((ref) => projectMatchesSpecialtyRef(project, ref)),
    );

    for (const project of matchedProjects) {
      if (existingProjectIds.has(project.id)) {
        continue;
      }
      addProject(project);
      existingProjectIds.add(project.id);
    }

    track("calculator-specialty-added", {
      specialty: specialty.name.en,
      projectsAdded: matchedProjects.length,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
      <Button
        variant="secondary"
        // biome-ignore lint: The role attribute is fine
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={locale === "pt" ? "Adicionar projeto" : "Add project"}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {locale === "pt" ? "Adicionar projeto" : "Add a project"}
        <CirclePlus className="ml-2 size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={locale === "pt" ? "Adicionar projeto" : "Add a project"}
      >
        <CommandInput
          placeholder={
            locale === "pt" ? "Pesquisar projetos..." : "Search projects..."
          }
        />
        <CommandList>
          <CommandEmpty>
            {locale === "pt"
              ? "Nenhum projeto encontrado."
              : "No projects found."}
          </CommandEmpty>
          <CommandGroup heading={locale === "pt" ? "Projetos" : "Projects"}>
            <ScrollArea className="h-[250px]">
              {rootProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    addProject(project);

                    setValue("");
                    setOpen(false);

                    track("calculator-project-added", {
                      project: project.name,
                    });
                  }}
                  className="h-8 cursor-pointer"
                  // biome-ignore lint: The role attribute is fine
                  role="option"
                  aria-label={`${
                    locale === "pt" ? "Selecionar projeto" : "Select project"
                  } ${project.name}`}
                >
                  {project.name}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Select
        value={selectedSpecialtyId}
        onValueChange={setSelectedSpecialtyId}
      >
        <SelectTrigger
          className="w-[260px]"
          aria-label={locale === "pt" ? "Selecionar especialidade" : "Select specialty"}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty) => (
            <SelectItem
              key={specialty.id}
              value={specialty.id}
            >
              {specialty.name[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => {
          const specialty = specialties.find((item) => item.id === selectedSpecialtyId);
          if (!specialty) {
            return;
          }
          addSpecialtyProjects(specialty);
        }}
        aria-label={
          locale === "pt"
            ? "Adicionar todos os projetos da especialidade"
            : "Add all projects from specialty"
        }
      >
        {locale === "pt" ? "Adicionar especialidade" : "Add specialty"}
      </Button>
    </div>
  );
}
