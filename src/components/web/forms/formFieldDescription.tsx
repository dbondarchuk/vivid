import { FormDescription } from "@/components/ui/form";
import { MdxContent } from "../mdx/mdxContentClient";

export const FormFieldDescription: React.FC<{
  description?: string;
  className?: string;
}> = ({ description, className }) => {
  return description ? (
    <FormDescription className={className}>
      <MdxContent source={description} />
    </FormDescription>
  ) : null;
};
