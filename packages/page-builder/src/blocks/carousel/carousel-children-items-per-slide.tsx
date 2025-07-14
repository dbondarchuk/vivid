import { Percent } from "lucide-react";
import { z } from "zod";
import { Input } from "@vivid/ui";
import { StyleDefinition } from "../../style/types";
import { RawNumberInput } from "../../style-inputs/base/raw-number-input";

const CarouselChildrenItemsPerSlideSchema = z.coerce
  .number()
  .min(1)
  .max(12)
  .int();

export const carouselChildrenItemsPerSlideStyle = {
  name: "carouselChildrenItemsPerSlide",
  label: "pageBuilder.blocks.carousel.styles.carouselChildrenItemsPerSlide",
  category: "layout",
  schema: CarouselChildrenItemsPerSlideSchema,
  icon: ({ className }: { className?: string }) => (
    <Percent className={className} />
  ),
  defaultValue: 1,
  renderToCSS: (
    value:
      | z.infer<typeof CarouselChildrenItemsPerSlideSchema>
      | null
      | undefined
  ) => {
    if (value === null || typeof value === "undefined") return null;
    // Calculate flex-basis as percentage: 100 / items
    const flexBasis = parseFloat((100 / value).toFixed(2));
    return `flex-basis: ${flexBasis}%;`;
  },
  component: ({ value, onChange }) => (
    <RawNumberInput
      min={1}
      max={10}
      step={1}
      value={value || 1}
      setValue={(value) => onChange(value)}
      iconLabel={<Percent className="size-4" />}
      options={[1, 2, 3, 5]}
    />
  ),
  selector: ".carousel-item",
} as const satisfies StyleDefinition<
  typeof CarouselChildrenItemsPerSlideSchema
>;
