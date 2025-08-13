export const postUploadToS3 = async (presignedUrl: string, imageKey: string, file: File) => {
    try {
      //  FormData 생성 및 파일 업로드
      const formData = new FormData();
      formData.append("Content-Type", file.type);
      formData.append("file", file);
  
      const uploadRes = await fetch(presignedUrl, {
        method: "POST",
        body: formData,
      });
  
      // 업로드
      if (!uploadRes.ok) {
        if (uploadRes.status === 403) {
          console.log('업로드 실패:', uploadRes);
        } else if (uploadRes.status >= 500) {
          console.log('업로드 실패:', uploadRes);
        } else {
          console.log('업로드 실패:', uploadRes);
        }
      }
  
      // 성공 시 S3 URL 반환
      return imageKey;
    } catch {
      console.log('업로드 실패');
    }   
  };