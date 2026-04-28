import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Program from "@/models/Program";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
    }

    await dbConnect();
    const program = await Program.findById(id).populate("courses");

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error: any) {
    console.error("Get program error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    await dbConnect();
    const updatedProgram = await Program.findByIdAndUpdate(id, body, { new: true });

    if (!updatedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProgram);
  } catch (error: any) {
    console.error("Update program error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
    }

    await dbConnect();
    const deletedProgram = await Program.findByIdAndDelete(id);

    if (!deletedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error: any) {
    console.error("Delete program error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
