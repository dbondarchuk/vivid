import { ServicesContainer } from "@vivid/services";
import { NextApiRequest, NextApiResponse } from "next";

export async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const name = request.query.name as string;
  const service = ServicesContainer.ConnectedAppService();

  await service.processRedirect(name, request);

  return response
    .status(201)
    .setHeader("content-type", "text/html")
    .send(`<html><script>window.close()</script></html>`);
}
