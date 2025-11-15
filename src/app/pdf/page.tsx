// app/pdf/page.tsx
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs"; // needed for Buffer

type Props = {
  searchParams: { url?: string };
};

export default async function PdfToHtmlPage({ searchParams }: Props) {
  const url = searchParams.url;

  if (!url) {
    return (
      <main style={{ padding: 24 }}>
        <h1>PDF → HTML</h1>
        <p>
          Add <code>?url=/path/to/file.pdf</code> to the URL.
        </p>
      </main>
    );
  }

  // Fetch the PDF (could be from /public, S3, etc.)
  const res = await fetch(url);
  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <p>
          Failed to fetch PDF: {res.status} {res.statusText}
        </p>
      </main>
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  const parser = new PDFParse({ data: arrayBuffer });
  const textResult = await parser.getText();
  const text = textResult.text;

  // Clean up
  await parser.destroy();

  return (
    <main style={{ padding: 24 }}>
      <h1>PDF as HTML</h1>
      <pre
        style={{ whiteSpace: "pre-wrap", fontFamily: "system-ui, sans-serif" }}
      >
        {text}
      </pre>
    </main>
  );
}
