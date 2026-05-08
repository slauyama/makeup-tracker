import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import type { Product } from "./hooks/useProducts";
import { useModal } from "./hooks/useModal";
import AddProductModal from "./components/AddProductModal";
import ImportExportModal from "./components/ImportExportModal";
import ProductModal from "./components/ProductModal";
import ProductCard from "./components/ProductCard";
import StatsView from "./components/StatsView";
import Button from "./components/ui/Button";
import Heading from "./components/ui/Heading";
import Text from "./components/ui/Text";
import Select from "./components/ui/Select";
import { ALL_CATEGORIES, ProductStatus } from "./constants";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
];

const STATUS_FILTERS: Array<ProductStatus | "all"> = [
  "all",
  ProductStatus.Active,
  ProductStatus.Finished,
];

type SortField = "dateBought" | "price" | "createdAt";
type SortDir = "asc" | "desc";

const SORT_OPTIONS = [
  { value: "dateBought", label: "Date Bought" },
  { value: "brand", label: "Brand" },
  { value: "price", label: "Cost" },
];

function sortProducts(
  products: Product[],
  field: SortField,
  dir: SortDir,
): Product[] {
  return [...products].sort((a, b) => {
    let cmp = 0;
    if (field === "price") {
      if (a.price == null && b.price == null) cmp = 0;
      else if (a.price == null) return 1;
      else if (b.price == null) return -1;
      else cmp = a.price - b.price;
    } else {
      const av = a[field];
      const bv = b[field];
      if (!av && !bv) cmp = 0;
      else if (!av) return 1;
      else if (!bv) return -1;
      else cmp = av < bv ? -1 : av > bv ? 1 : 0;
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

export default function App() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    importProducts,
  } = useProducts();

  const [showStats, setShowStats] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const addProductModal = useModal();
  const importExportModal = useModal();
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const activeCount = products.filter(
    (p) => p.status === ProductStatus.Active,
  ).length;

  const filtered = sortProducts(
    products.filter((p) => {
      const statusOk = statusFilter === "all" || p.status === statusFilter;
      const catOk = categoryFilter === "all" || p.category === categoryFilter;
      return statusOk && catOk;
    }),
    sortField,
    sortDir,
  );

  // Always pass the freshest copy of the open product to ProductModal
  const liveProduct = activeProduct
    ? (products.find((p) => p.id === activeProduct.id) ?? null)
    : null;

  return (
    <div className="min-h-screen bg-rose-50 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <Heading as="h1" variant="display">
              Beauty Tracker
            </Heading>
            <Text variant="muted" as="p" className="mt-0.5">
              {activeCount} product{activeCount !== 1 ? "s" : ""} in use
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              active={showStats}
              onClick={() => setShowStats((v) => !v)}
            >
              {showStats ? "← Products" : "Stats"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={importExportModal.open}
              className="hidden sm:inline-flex"
            >
              Import / Export
            </Button>
            <Button onClick={addProductModal.open}>
              <span className="sm:hidden">+ Add</span>
              <span className="hidden sm:inline">+ Add Product</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {showStats && <StatsView products={products} />}

        {!showStats && (
          <>
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              {STATUS_FILTERS.map((f) => (
                <Button
                  key={f}
                  variant="pill"
                  active={statusFilter === f}
                  onClick={() => setStatusFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}

              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={CATEGORY_OPTIONS}
              />

              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                options={SORT_OPTIONS}
              />
              <button
                onClick={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
                className="text-sm text-zinc-500 hover:text-zinc-700 px-2 py-1 rounded-lg hover:bg-zinc-100 transition dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-700"
                title={sortDir === "asc" ? "Ascending" : "Descending"}
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Text variant="muted" as="p" className="text-5xl mb-3">
                  💄
                </Text>
                <Text
                  variant="body"
                  as="p"
                  className="text-lg font-medium text-zinc-500"
                >
                  {products.length === 0
                    ? "No products yet"
                    : "No products match these filters"}
                </Text>
                {products.length === 0 && (
                  <Text variant="muted" as="p" className="mt-1">
                    Hit{" "}
                    <button
                      onClick={addProductModal.open}
                      className="text-rose-400 underline hover:text-rose-500"
                    >
                      + Add Product
                    </button>{" "}
                    to get started!
                  </Text>
                )}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-start">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={() => setActiveProduct(product)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <ProductModal
        product={liveProduct}
        onClose={() => setActiveProduct(null)}
        onSave={(data) => {
          if (liveProduct) updateProduct(liveProduct.id, data);
        }}
        onDelete={() => {
          if (liveProduct) {
            deleteProduct(liveProduct.id);
            setActiveProduct(null);
          }
        }}
        updateProductStatus={updateProductStatus}
        categories={ALL_CATEGORIES}
      />

      <AddProductModal
        categories={ALL_CATEGORIES}
        onSave={(data) => {
          addProduct(data);
          addProductModal.close();
        }}
        modalControls={addProductModal}
      />

      <ImportExportModal
        modalControls={importExportModal}
        products={products}
        onImport={(incoming, merge) => importProducts(incoming, merge)}
      />
    </div>
  );
}
