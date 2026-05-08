import { useRef, useState } from "react";
import { Product } from "../hooks/useProducts";
import { Button, Heading, Modal, Text } from "./ui/UI";
import { ModalControls } from "../hooks/useModal";
import DropzoneButton from "./DropzoneButton";

interface ImportExportModalProps {
  products: Product[];
  onImport: (products: Product[], merge: boolean) => void;
  modalControls: ModalControls;
}

function downloadJSON(products: Product[]) {
  const blob = new Blob([JSON.stringify(products, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `makeup-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type ImportMode = "merge" | "replace";

export default function ImportExportModal({
  products,
  onImport,
  modalControls,
}: ImportExportModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Product[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [mode, setMode] = useState<ImportMode>("merge");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed))
          throw new Error("File must contain a JSON array.");
        if (parsed.length === 0) throw new Error("File contains no products.");
        if (!parsed[0]?.id || !parsed[0]?.name)
          throw new Error("File doesn't look like a makeup-tracker export.");
        setPreview(parsed as Product[]);
        setParseError(null);
      } catch (err) {
        setParseError(
          err instanceof Error ? err.message : "Could not parse file.",
        );
        setPreview(null);
      }
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!preview) return;
    onImport(preview, mode === "merge");
    modalControls.close();
  }

  return (
    <Modal modalControls={modalControls} title="Import / Export">
      <div className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Heading as="h3" variant="subtitle">
            Export
          </Heading>
          <Button
            variant="secondary"
            size="sm"
            disabled={products.length === 0}
            onClick={() => downloadJSON(products)}
            className="self-start mt-1"
          >
            Download JSON
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-700" />
          <Text variant="caption" className="text-zinc-300">
            or
          </Text>
          <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-700" />
        </div>

        <div className="flex flex-col gap-3">
          <Heading as="h3" variant="subtitle">
            Import
          </Heading>
          <Text variant="caption" className="text-zinc-400">
            Load products from a previously exported JSON file.
          </Text>

          <DropzoneButton
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            {preview
              ? `✓ ${preview.length} product${preview.length !== 1 ? "s" : ""} ready to import`
              : "Click to choose a .json file"}
          </DropzoneButton>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFile}
          />

          {parseError && (
            <Text variant="caption" className="text-red-400">
              {parseError}
            </Text>
          )}

          {preview && (
            <div className="flex gap-2">
              <Button
                variant={mode === "merge" ? "secondary" : "ghost"}
                size="none"
                type="button"
                onClick={() => setMode("merge")}
                className="flex-1 flex-col items-start text-xs px-3 py-2"
              >
                Merge
                <span className="font-normal text-zinc-400 mt-0.5">
                  Add new, keep existing
                </span>
              </Button>
              <Button
                variant={mode === "replace" ? "secondary" : "ghost"}
                size="none"
                type="button"
                onClick={() => setMode("replace")}
                className="flex-1 flex-col items-start text-xs px-3 py-2"
              >
                Replace
                <span className="font-normal text-zinc-400 mt-0.5">
                  Overwrite all current data
                </span>
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant="secondary"
              onClick={modalControls.close}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!preview}
              className="flex-1"
            >
              Import
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
