"use client";
import DocViewer, {
  MSDocRenderer,
  PDFRenderer,
} from "@cyntler/react-doc-viewer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomFileRenderer = ({ mainState: { currentDocument } }: any) => {
  if (!currentDocument || !currentDocument.uri) return null;
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    currentDocument.uri
  )}`;

  return (
    <object
      data={viewerUrl}
      style={{ width: "100%", height: "80vh", border: "none" }}
      type={`application/pdf`}
    >
      <p>
        Không Thể Trình Chiếu File PDF. Vui Lòng Tải{" "}
        <a href={viewerUrl}>File</a>.
      </p>
    </object>
  );
};

CustomFileRenderer.fileTypes = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
CustomFileRenderer.weight = 10;

const Slide = ({
  slide,
  preChapter,
  nextChapterId,
  courseId,
  isCompleted,
  chapter,
  course,
}: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const [onFinish, setOnFinish] = useState(false);
  const [doc, setDoc] = useState(slide[currentSlide]?.fileUrl);
  const [hasCompleted, setHasCompleted] = useState(
    isCompleted == "finished" &&
      course.ClassSessionRecord[0].status == "finished"
      ? "finished"
      : "studying"
  );

  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false); // Set loading to false when iframe finishes loading
  };

  const confetti = useConfettiStore();
  const supportedFileTypes = ["pdf", "pptx", "docx"];
  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    return supportedFileTypes.includes(extension!) ? extension : "default";
  };

  const onClickNextSlide = async () => {
    setCurrentSlide(currentSlide + 1);
    setDoc(slide[currentSlide].fileUrl);
    setIsLoading(true);
    router.refresh();
  };

  const onClickPre = async () => {
    router.push(`/courses/${courseId}/chapters/${preChapter}`);
  };

  const onClick = async () => {
    let moduleId = chapter.id;
    if (nextChapterId != null) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    } else {
      // Khi đã hoàn thành tất cả các chapter, đánh dấu khóa học là "finished"
      await axios.put(`/api/module/${moduleId}/progress`, {
        status: "finished", // Đánh dấu trạng thái là "finished"
        progress: "100%", // Đặt tiến độ là 100%
        endDate: new Date(),
      });

      // Cập nhật trạng thái khóa học là hoàn thành
      await axios.put(`/api/courses/${courseId}/progress`, {
        status: "finished", // Đánh dấu toàn bộ khóa học hoàn thành
        progress: "100%", // Đặt tiến độ khóa học là 100%
      });

      confetti.onOpen();
      let currentUser = await axios.get(`/api/user`);
      await axios.patch(`/api/user/${currentUser.data.id}/score`, {
        star: parseInt(currentUser.data.star) + parseInt(course.credit),
      });
      setOnFinish(true);
      setHasCompleted("finished");
      router.push(`/`);
      router.refresh();
    }
  };

  const accept = () => {
    setOnFinish(false);
    router.push(`/`);
    router.refresh();
  };

  return slide.length < 1 ? (
    <>Học Phần Này Đang Được Điều Chỉnh.</>
  ) : (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AlertDialog open={onFinish && hasCompleted != "finished"}>
          <AlertDialogContent className="AlertDialogContent">
            <AlertDialogTitle className="AlertDialogTitle">
              Chúc Mừng Bạn Đã Hoàn Thành Khóa Học, Bạn Có Muốn Tìm Kiếm Khóa
              Khác?
              <Image
                src="/congratulation.jpg"
                alt="blog"
                height={300}
                width={400}
                className="select-none object-cover rounded-md border-2 border-white shadow-md drop-shadow-md w-150 h-full"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="AlertDialogDescription"></AlertDialogDescription>
            <div
              style={{
                display: "flex",
                gap: 25,
                justifyContent: "flex-end",
              }}
            >
              <AlertDialogCancel onClick={() => setOnFinish(false)}>
                Ở Lại
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button className="Button red" onClick={() => accept()}>
                  Rời Đi
                </button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <div>
          {slide[currentSlide].contentType == "video" ? (
            <div className="ml-4 mt-4">
              <video width="1080" height="720" controls autoPlay>
                <source src={slide[currentSlide].videoUrl} type="video/mp4" />
                Trình Duyệt Của Bạn Không Hỗ Trợ Loại Video Này.
              </video>
              <div>{slide[currentSlide].description}</div>
            </div>
          ) : slide[currentSlide].contentType == "text" ? (
            <div key={slide[currentSlide].id}>
              <div>{slide[currentSlide].title}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: slide[currentSlide].content,
                }}
              ></div>
            </div>
          ) : getFileType(slide[currentSlide].fileUrl) != "pdf" ? (
            <DocViewer
              prefetchMethod="GET"
              documents={[
                {
                  uri: slide[currentSlide].fileUrl,
                  fileType: getFileType(slide[currentSlide].fileUrl),
                },
              ]}
              pluginRenderers={[MSDocRenderer]}
              style={{ width: 1080, height: 650 }}
              theme={{ disableThemeScrollbar: false }}
            />
          ) : (
            // <>
            // {isLoading && (
            //   <div>
            //     {" "}
            //     <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>{" "}
            //     Loading ...
            //   </div>
            // )}
            <iframe
              key={slide[currentSlide].fileUrl}
              src={slide[currentSlide].fileUrl}
              // style={{ width: 1080, height: 650 }}
              // src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              //   slide[currentSlide].fileUrl
              // )}&embedded=true`}
              style={{ width: "100%", height: 650 }}
              // loading="lazy"
              // loading="lazy"
              // frameBorder="0"
              // onLoad={handleIframeLoad}
            />
           
          )}

          <div className="items-end">
            {currentSlide == 0 ? (
              <></>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                onClick={() => setCurrentSlide(currentSlide - 1)}
              >
                Quay Về
              </button>
            )}

            {currentSlide === slide.length - 1 ? (
              nextChapterId !== undefined ? (
                <div>
                  <button
                    onClick={() => onClick()}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 ml-4"
                  >
                    Học Phần Tiếp Theo
                  </button>
                </div>
              ) : (
                <div>
                  {preChapter && (
                    <button
                      onClick={() => onClickPre()}
                      className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                    >
                      Học Phần Trước
                    </button>
                  )}

                  <button
                    onClick={() => onClick()}
                    className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                  >
                    {hasCompleted != "finished"
                      ? "Hoàn Thành Khóa Học"
                      : "Về Trang Chủ"}
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={() => onClickNextSlide()}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 ml-4"
              >
                Học Phần Tiếp Theo
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default Slide;
