import { openPromptInput } from "./PromptInput";
import { openPromptConfirm } from "./PromptConfirm";
import { openPromptTemplateSelect } from "./PromptTemplateSelect";

window.Prompt = {
    input: openPromptInput,
    confirm: openPromptConfirm,
    templateSelect: openPromptTemplateSelect
}