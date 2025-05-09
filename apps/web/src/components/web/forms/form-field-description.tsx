import { FormDescription } from "@vivid/ui";
import { MdxContent } from "../mdx/mdx-content-client";

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
