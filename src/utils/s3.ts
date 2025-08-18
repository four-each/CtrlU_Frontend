export const postUploadToS3 = async (presignedUrl: string, imageKey: string, file: File, contentType: string) => {
    try {
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          'Content-Type': contentType
        },
        body: file
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