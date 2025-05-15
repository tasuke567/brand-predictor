import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import axios from "axios";

const ModelManagerPage = () => {
  const [info,setInfo]=useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchInfo = async ()=> setInfo((await axios.get("/admin/model")).data);
  const upload   = async ()=> {
    const f = fileRef.current!.files?.[0]; if(!f) return;
    const fd = new FormData(); fd.append("file",f);
    await axios.post("/admin/model",fd, {headers:{'Content-Type':'multipart/form-data'}});
    toast.success("Model hot-swapped 🚀"); fetchInfo();
  };
  const remove = async ()=>{ await axios.delete("/admin/model"); toast("Model nuked 👋"); setInfo(null); };

  useEffect(()=>{ fetchInfo().catch(()=>{}); },[]);
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="space-y-4">
        <input ref={fileRef} type="file" accept=".model" className="block" />
        <Button onClick={upload}>Upload / Replace</Button>
        {info && (
          <>
            <p>Last updated: {dayjs(info.updatedAt).fromNow()}</p>
            <p>Size: {(info.size/1024).toFixed(1)} KB</p>
            <p>Class: {info.classAttr}</p>
            <Button variant="solid" onClick={remove}>Delete</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
export default ModelManagerPage;