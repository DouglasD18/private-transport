import { GoogleApiPayload } from "@/domain/models"
import { GoogleApiRepositoryAdapter } from "@/infra/google-api/request"

const PAYLOAD: GoogleApiPayload = {
  origin: "Sobral, CE",
  destination: "Jericoacara, CE"
}

const sut = new GoogleApiRepositoryAdapter();

describe.skip("GoogleApiRepositoryAdapter", () => {
  it("Should return a correct response", async () => {
    const response = await sut.handle(PAYLOAD);

    expect(response).toHaveProperty('distance');
    expect(response).toHaveProperty('duration');
    expect(response.origin).toHaveProperty('latitude');
    expect(response.origin).toHaveProperty('longitude');
    expect(response.destination).toHaveProperty('latitude');
    expect(response.destination).toHaveProperty('longitude');

    expect(typeof response.distance).toBe("number");
    expect(typeof response.duration).toBe("string");
    expect(typeof response.origin.latitude).toBe("number");
    expect(typeof response.origin.longitude).toBe("number");
    expect(typeof response.destination.latitude).toBe("number");
    expect(typeof response.destination.longitude).toBe("number");
  })
})