"use client";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Trash, PlusCircle, Asterisk } from "lucide-react";
import dynamic from "next/dynamic";

const Link = dynamic(() => import("next/link"), { ssr: false });

interface AttachmentFormProps {
  // courseId: string;
  moduleId: string;
}

export const ContentForm = ({ moduleId }: AttachmentFormProps) => {
  const [contents, setContents] = useState<
    Array<{
      fileUrl: string;
      description: string;
      id: string;
      title: string;
      moduleId: string;
      content: string;
      contentType: string;
      videoUrl: string;
      Resource: Array<any>;
    }>
  >([]);
  const [currentTab, setCurrentTab] = useState("");
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addContent = () => {
    const newContent = {
      id: generateId(),
      title: "New page",
      moduleId,
      description: "",
      content: "",
      contentType: "video",
      videoUrl: "",
      fileUrl: "",
      Resource: [],
    };
    setCurrentTab(newContent.id);
    setContents([...contents, newContent]);
  };

  const removeContent = (id: string) => {
    setContents(contents.filter((content) => content.id !== id));
  };

  useEffect(() => {
    const loadData = async () => {
      const { data } = await axios.get(
        `/api/module/${moduleId}/slide`
      );
      if (data.length > 0) {
        setCurrentTab(data[0].id);
        setContents(data);
      }
    };
    loadData();
  }, [moduleId]);

  const router = useRouter();

  const onSubmit = async () => {
    try {
      await axios.post(`/api/module/${moduleId}/slide`, {
        contents,
      });
      toast.success("Nội dung đã được cập nhật");
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const handleChange = (field: string, value: string, id: string) => {
    setContents(
      contents.map((content) =>
        content.id === id ? { ...content, [field]: value } : content
      )
    );
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    id: string,
    field: "fileUrl" | "videoUrl"
  ) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const getToken = await axios.get("/api/getToken");
      // const { data: getCourse } = await axios.get(`/api/courses/${courseId}`);
      const { data: getModule } = await axios.get(
        `/api/module/${moduleId}`
      );

      const uploadUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Module/${getModule.title}/${file.name}`;

      await axios.put(uploadUrl, file, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": file.type,
          "X-Auth-Token": getToken.data["x-subject-token"],
        },
      });

      handleChange(field, uploadUrl, id);
    } catch {
      toast.error("Tải tệp lên thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border dark:text-white rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        <div className="flex items-center">
          Nội dung bài giảng <Asterisk className="size-4" color="red" />
        </div>
        <button
          onClick={addContent}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Thêm nội dung
        </button>
      </div>

      <div className="flex flex-col mb-4">
        {contents.map((item) => (
          <div
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`cursor-pointer p-2 rounded-md ${
              currentTab === item.id ? "bg-gray-200 dark:bg-lime-900" : ""
            }`}
          >
            {item.title}
          </div>
        ))}
      </div>

      {contents
        .filter((item) => item.id === currentTab)
        .map((item) => (
          <div key={item.id} className="mb-4">
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleChange("title", e.target.value, item.id)}
                className="border p-2 rounded-md w-full"
              />
              <select
                value={item.contentType}
                onChange={(e) =>
                  handleChange("contentType", e.target.value, item.id)
                }
                className="border p-2 rounded-md ml-2"
              >
                <option value="video">Video</option>
                <option value="file">File</option>
                <option value="text">Text</option>
              </select>
              <button
                onClick={() => removeContent(item.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-md ml-2"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>

            {item.contentType === "video" ? (
              <div className="mb-4">
                <div className="font-medium mb-2">
                  {item.videoUrl ? "Cập nhật video" : "Thêm video"}
                </div>
                <div className="mb-2">
                  {item.videoUrl && !edit ? (
                    <Link
                      href={item.videoUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {item.videoUrl.split("/").pop()}
                    </Link>
                  ) : (
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, item.id, "videoUrl")}
                      accept="video/*"
                      className="file-input"
                    />
                  )}
                  {item.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setEdit(!edit)}
                      className="ml-2"
                    >
                      {edit ? "Hủy" : "Chỉnh sửa"}
                    </button>
                  )}
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value, item.id)
                  }
                  className="border p-2 rounded-md w-full"
                  placeholder="Mô tả"
                ></textarea>
              </div>
            ) : item.contentType === "text" ? (
              <div className="mb-4">
                <Editor
                  apiKey="8jo1uligpkc7y1v598qze63nfgfvcflmy7ifyfqt9ah17l7m"
                  value={item.content}
                  onEditorChange={(content) =>
                    handleChange("content", content, item.id)
                  }
                  init={{
                    height: 500,
                    width: "auto",
                    plugins: [
                      "advlist autolink lists link image charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table code help wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    paste_data_images: true,
                  }}
                />
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value, item.id)
                  }
                  className="border p-2 rounded-md w-full mt-4"
                  placeholder="Mô tả"
                ></textarea>
              </div>
            ) : (
              <div className="mb-4">
                <div className="font-medium mb-2">
                  {item.fileUrl ? "Cập nhật tệp" : "Thêm tệp"}
                </div>
                <div className="mb-2">
                  {item.fileUrl && !edit ? (
                    <Link
                      href={item.fileUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {item.fileUrl.split("/").pop()}
                    </Link>
                  ) : (
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, item.id, "fileUrl")}
                      accept="application/*"
                      className="file-input"
                    />
                  )}
                  {item.fileUrl && (
                    <button
                      type="button"
                      onClick={() => setEdit(!edit)}
                      className="ml-2"
                    >
                      {edit ? "Hủy" : "Chỉnh sửa"}
                    </button>
                  )}
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value, item.id)
                  }
                  className="border p-2 rounded-md w-full"
                  placeholder="Mô tả"
                ></textarea>
              </div>
            )}
          </div>
        ))}

      {contents.length > 0 && (
        <div className="flex justify-end">
          {isLoading ? (
            <button
              disabled
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Đang chờ...
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Lưu
            </button>
          )}
        </div>
      )}
    </div>
  );
};
