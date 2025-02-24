"use client";
import { CommunicationChannelTexts } from "@/constants/labels";
import { CommunicationChannel } from "@vivid/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Spinner,
  DialogFooter,
  DialogClose,
  Button,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Link,
  Combobox,
} from "@vivid/ui";
import { Plus } from "lucide-react";
import React from "react";
import { TemplateTemplates } from "./templates";

export const AddNewTemplateButton: React.FC = () => {
  const [type, setType] = React.useState<CommunicationChannel>("email");
  const [template, setTemplate] = React.useState<string>("");

  const availableTemplates = [
    {
      label: "Empty template",
      value: "",
    },
    ...Object.entries(TemplateTemplates[type] || {}).map(
      ([name, { name: displayName }]) => ({
        label: displayName,
        value: name,
      })
    ),
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" /> Add new template
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-96" overlayVariant="blur">
        <DialogHeader className="px-1">
          <DialogTitle>Add new template</DialogTitle>
        </DialogHeader>
        <div className="w-full  px-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <div className="flex w-full">
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value as CommunicationChannel);
                  setTemplate("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {Object.entries(CommunicationChannelTexts).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Template</Label>
            <div className="flex w-full">
              <Combobox
                values={availableTemplates}
                value={template}
                onItemSelect={setTemplate}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="px-1">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Link
            button
            variant="default"
            aria-disabled={!!type}
            href={`/admin/dashboard/templates/new/${type}${template ? `?template=${encodeURIComponent(template)}` : ""}`}
          >
            Add new template
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
