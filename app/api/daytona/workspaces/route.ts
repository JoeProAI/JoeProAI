import { NextRequest, NextResponse } from 'next/server';
import { listWorkspaces, createWorkspace } from '@/lib/llm/daytona-client';

export async function GET() {
  try {
    const workspaces = await listWorkspaces();
    return NextResponse.json({ workspaces });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, repositoryUrl, branch, image } = body;

    if (!name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    }

    const workspace = await createWorkspace({
      name,
      repositoryUrl,
      branch,
      image
    });

    return NextResponse.json({ workspace });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
