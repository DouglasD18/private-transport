import { Validated } from "@/domain/models";
import { Validator } from "@/domain/useCases";
import { BadRequestError } from "@/presentation/errors";

export class PostBodyValidatorAdapter implements Validator {
  handle(data: any): Validated {
    const fields = ['origin', 'destination', 'customerId'];
    
    for (const field of fields) {
      if (!data[field] || data[field].trim().length === 0) {
        return {
          isValid: false,
          error: new BadRequestError(`O campo ${field} é obrigatório!`)
        }
      }
    }

    const origin = data['origin'].trim();
    const destination = data['destination'].trim();

    if (origin === destination) {
      return {
        isValid: false,
        error: new BadRequestError(`Os campos detination e origin não podem ser iguais!`)
      }
    } 

    return {
      isValid: true
    }
  }
  
}
