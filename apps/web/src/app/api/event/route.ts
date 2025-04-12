import { ServicesContainer } from "@vivid/services";
import { AppointmentEvent } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const json = formData.get("json") as string;
  if (!json) {
    return NextResponse.json(
      {
        success: false,
        error: "json_missing",
        message: "JSON with event data is missing",
      },
      { status: 400 }
    );
  }

  const event = JSON.parse(json) as AppointmentEvent;

  if (
    !event ||
    !event.totalDuration ||
    !event.dateTime ||
    !event.fields.name ||
    !event.fields.email
  )
    return NextResponse.json({ error: "event is required" }, { status: 400 });

  let files: Record<string, File> | undefined = undefined;
  const fileFields = formData.getAll("fileField") as string[];
  if (!!fileFields) {
    try {
      files = fileFields.reduce(
        (map, fileField) => {
          const file = formData.get(`file_${fileField}`) as File;
          if (!file) {
            throw new Error("File field is not present");
          }

          return {
            ...map,
            [fileField]: file,
          };
        },
        {} as Record<string, File>
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: "file_not_uploaded", message: e?.message },
        { status: 400 }
      );
    }

    try {
      const { _id } = await ServicesContainer.EventsService().createEvent({
        event,
        files,
      });
      return NextResponse.json({ success: true, id: _id }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: "time_not_available", message: e?.message },
        { status: 400 }
      );
    }
  }
}
