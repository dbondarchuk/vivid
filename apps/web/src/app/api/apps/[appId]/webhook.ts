import { ServicesContainer } from "@vivid/services";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  result: NextApiResponse<any>
) {
  const appId = request.query.appId as string;
  if (!appId) {
    return result.status(400).json({ error: "AppId is required" });
  }

  const service = ServicesContainer.ConnectedAppService();

  await service.processWebhook(appId, request, result);

  if (!result.statusCode) {
    result.status(200);
  }
}
