import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { formatBytes } from "@/utils/formatBytes";
import "../styles/model-manager.css";
type Metrics = { accuracy: number | null; kappa: number | null };
interface ModelInfo {
  updatedAt: string;
  size: number;
  classAttr: string;
  metrics?: Metrics;
}

/* ---------------- react-query fetch ---------------- */
const useModelInfo = () =>
  useQuery({
    queryKey: ["model-info"],
    queryFn: () => api.get<ModelInfo>("/model-info").then((r) => r.data),
    retry: false,
  });

export default function ModelManagerPage() {
  const qc = useQueryClient();
  const modelFile = useRef<HTMLInputElement>(null);
  const trainFile = useRef<HTMLInputElement>(null);

  const { data: info } = useModelInfo();

  /* ---------------- upload ---------------- */
  const uploadMut = useMutation({
    mutationFn: async () => {
      const f = modelFile.current?.files?.[0];
      if (!f || !f.name.endsWith(".model"))
        throw new Error("เลือกไฟล์ .model ก่อนนะ");
      const fd = new FormData();
      fd.append("file", f);
      await api.post("/admin/model", fd);
    },
    onSuccess: () => {
      toast.success("โมเดลอัพเดตแล้ว 🚀");
      qc.invalidateQueries({ queryKey: ["model-info"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  /* ---------------- train ---------------- */
  const trainMut = useMutation({
    mutationFn: async () => {
      const f = trainFile.current?.files?.[0];
      if (!f) throw new Error("เลือกไฟล์ dataset ก่อนนะ");
      const fd = new FormData();
      fd.append("file", f);
      await api.post("/train", fd);
    },
    onSuccess: () => {
      toast.success("Train เสร็จเรียบร้อย 🎉");
      qc.invalidateQueries({ queryKey: ["model-info"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  /* ---------------- delete ---------------- */
  const delMut = useMutation({
    mutationFn: () => api.delete("/admin/model"),
    onSuccess: () => {
      toast("ลบโมเดลแล้ว 👋");
      qc.invalidateQueries({ queryKey: ["model-info"] });
    },
    onError: () => toast.error("ลบไม่สำเร็จ"),
  });

  return (
    <div className="model-manager">
      <Card className="model-card">
        <CardContent className="mm-grid">
          {/* Upload model */}
          <section className="mm-section">
            <h3 className="font-semibold">📦 Hot-swap Model</h3>
            <input
              ref={modelFile}
              className="mm-file"
              type="file"
              accept=".model"
            />
            <Button
              className="mm-btn"
              size="sm"
              disabled={uploadMut.isPending}
              onClick={() => uploadMut.mutate()}
            >
              {uploadMut.isPending ? "Uploading…" : "Upload / Replace"}
            </Button>
          </section>

          {/* Train */}
          <section className="mm-section">
            <h3 className="font-semibold">🛠️ Train New Model</h3>
            <input
              ref={trainFile}
              className="mm-file"
              type="file"
              accept=".csv,.arff"
            />
            <Button
              className="mm-btn"
              variant="outline"
              size="sm"
              disabled={trainMut.isPending}
              onClick={() => trainMut.mutate()}
            >
              {trainMut.isPending ? "Training…" : "Train & Replace"}
            </Button>
          </section>

          {/* Current model info */}
          {info?.updatedAt && (
            <section className="mm-section mm-meta">
              <h4 className="font-semibold mb-1">📑 Current model</h4>
              <p>Last updated: {(dayjs(info.updatedAt) as any).fromNow()}</p>
              <p>
                Size: <strong>{formatBytes(info.size)}</strong>
              </p>
              <p>
                Class: <code>{info.classAttr}</code>
              </p>
              {info.metrics && (
                <p>
                  Accuracy:{" "}
                  <strong>
                    {info.metrics.accuracy !== null
                      ? `${(info.metrics.accuracy * 100).toFixed(2)} %`
                      : "–"}
                  </strong>{" "}
                  | κ:{" "}
                  <strong>
                    {info.metrics.kappa !== null
                      ? info.metrics.kappa.toFixed(3)
                      : "–"}
                  </strong>
                </p>
              )}
              <Button
                className="mm-btn"
                variant="solid"
                size="sm"
                disabled={delMut.isPending}
                onClick={() => delMut.mutate()}
              >
                {delMut.isPending ? "Deleting…" : "Delete"}
              </Button>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
