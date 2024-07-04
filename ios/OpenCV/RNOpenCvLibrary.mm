#import "RNOpenCvLibrary.h"
#import <React/RCTLog.h>
//#include <base64.h>

@implementation RNOpenCvLibrary

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

//RCT_EXPORT_METHOD(CheckBlurryMaxLaplacian:(NSString *)imageAsBase64
//                  blurThreshold:(int)blurThreshold
//                  callback:(RCTResponseSenderBlock)callback) {
RCT_EXPORT_METHOD(CheckBlurryMaxLaplacian:(NSDictionary *) imageData
                  callback:(RCTResponseSenderBlock)callback) {
  NSString *imageAsBase64 = imageData[@"image"];
  // Extract blur threshold (handle potential missing key)
   NSNumber *thresholdNumber = imageData[@"threshold"];
   int blurThreshold = 0; // Default value if threshold is missing
   if (thresholdNumber != nil) {
       blurThreshold = [thresholdNumber intValue];
   }
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSDictionary *result = [self isImageBlurryMaxLaplacian:image blurThreshold:blurThreshold ];
  callback(@[[NSNull null],result]);
}
RCT_EXPORT_METHOD(checkForBlurryImageTenengrad:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  BOOL isImageBlurryResult = [self isImageBlurryTenengrad:image];
  
  id objects[] = { isImageBlurryResult ? @YES : @NO };
  NSString *resultString = @"This is from checkForBlurryImageTenengÏrad";
  NSUInteger count = sizeof(objects) / sizeof(id);
  NSArray *dataArray = [NSArray arrayWithObjects:objects
                                           count:count];
  
  callback(@[[NSNull null], dataArray,resultString]);
}

RCT_EXPORT_METHOD(CheckBlurryCannyEdge:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSDictionary *result = [self isImageBlurryCannyEdge:image];
  callback(@[[NSNull null], result]);
}

RCT_EXPORT_METHOD(CheckBlurryVarianceOfLaplacian:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSDictionary *result  = [self isImageBlurryVarianceOfLaplacian:image];
//  id objects[] = { isImageBlurryResult ? @YES : @NO };
//  NSString *resultString = @"This is from isImageBlurryMixedFunction";
//  NSUInteger count = sizeof(objects) / sizeof(id);
//  NSArray *dataArray = [NSArray arrayWithObjects:objects
//                                           count:count];
  callback(@[[NSNull null],result]);
}
RCT_EXPORT_METHOD(isImageBlurryMixedFunction:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  BOOL isImageBlurryResult = [self isImageBlurryMixed:image];
  
  id objects[] = { isImageBlurryResult ? @YES : @NO };
  NSString *resultString = @"This is from isImageBlurryMixedFunction";
  NSUInteger count = sizeof(objects) / sizeof(id);
  NSArray *dataArray = [NSArray arrayWithObjects:objects
                                           count:count];
  callback(@[[NSNull null], dataArray,resultString]);
}
RCT_EXPORT_METHOD(MyDetection:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSDictionary *result = [self ImageDetection:image];
  callback(@[[NSNull null], result]);
}

RCT_EXPORT_METHOD(convertImageLaplacian:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSString *base64Image = [self convertLaplacian:image];
//  NSString *resultString = @"This is convertImage";
  callback(@[[NSNull null], base64Image]);
}
RCT_EXPORT_METHOD(convertMYImage:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSDictionary *result = [self convertMYImageFunction:image];
//  NSString *resultString = @"This is convertImage";
  callback(@[[NSNull null], result]);
}
RCT_EXPORT_METHOD(convertImageCannyEdge:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  NSString *base64Image = [self convertCannyEdge:image];
//  NSString *resultString = @"This is convertImage";
  callback(@[[NSNull null], base64Image]);
}

- (cv::Mat)convertUIImageToCVMat:(UIImage *)image {
  CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
  CGFloat cols = image.size.width;
  CGFloat rows = image.size.height;
  cv::Mat cvMat(rows, cols, CV_8UC4); // 8 bits per component, 4 channels (color channels + alpha)
  CGContextRef contextRef = CGBitmapContextCreate(cvMat.data,                 // Pointer to  data
                                                  cols,                       // Width of bitmap
                                                  rows,                       // Height of bitmap
                                                  8,                          // Bits per component
                                                  cvMat.step[0],              // Bytes per row
                                                  colorSpace,                 // Colorspace
                                                  kCGImageAlphaNoneSkipLast |
                                                  kCGBitmapByteOrderDefault); // Bitmap info flags
  CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), image.CGImage);
  CGContextRelease(contextRef);
  return cvMat;
}
- (UIImage *)decodeBase64ToImage:(NSString *)strEncodeData {
  NSData *data = [[NSData alloc]initWithBase64EncodedString:strEncodeData options:NSDataBase64DecodingIgnoreUnknownCharacters];
  return [UIImage imageWithData:data];
}

- (BOOL)isImageBlurryTenengrad:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
  
  cv::Mat gradX, gradY;
  cv::Sobel(matImageGrey, gradX, CV_64F, 1, 0);
  cv::Sobel(matImageGrey, gradY, CV_64F, 0, 1);
  
  cv::Mat gradMag;
  cv::magnitude(gradX, gradY, gradMag);
  
  double meanGradMag = cv::mean(gradMag)[0];
//  RCTLogInfo(@"meanGradMag: %f", meanGradMag);
//  RCTLogInfo(@"matImageGrey: %c", matImageGrey);
  
  // Threshold for blur detection
//  double threshold = 50.0;  // Adjust this threshold based on your needs
  double threshold = calculateThresholdTenegrad(matImageGrey);
  
  return meanGradMag < threshold;
}

- (NSDictionary *) isImageBlurryMaxLaplacian:(UIImage *) image blurThreshold:(int)blurThreshold  {
  // converting UIImage to OpenCV format - Mat
  BOOL isBlurry = NO;
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  // converting image's color space (RGB) to grayscale
  cv::cvtColor(matImage, matImageGrey,cv::COLOR_BGRA2GRAY);
  cv::Mat dst2 = [self convertUIImageToCVMat:image];
  cv::Mat laplacianImage;
  dst2.convertTo(laplacianImage, CV_8UC1);
  
  // applying Laplacian operator to the image
  cv::Laplacian(matImageGrey, laplacianImage, CV_8U);
  cv::Mat laplacianImage8bit;
  laplacianImage.convertTo(laplacianImage8bit, CV_8UC1);
  
  unsigned char *pixels = laplacianImage8bit.data;
  
  // 16777216 = 256*256*256
  int maxLap = -16777216;
  for (int i = 0; i < ( laplacianImage8bit.elemSize()*laplacianImage8bit.total()); i++) {
    if (pixels[i] > maxLap) {
      maxLap = pixels[i];
    }
  }
//  RCTLogInfo(@"meanGradMag: %d", maxLap);
//  RCTLogInfo(@"blurThreshold HERE: %d", blurThreshold);
  // one of the main parameters here: threshold sets the sensitivity for the blur check
  // smaller number = less sensitive; default = 180
//  int threshold = 200;
  int threshold = blurThreshold;
  if (maxLap <= threshold) {
    isBlurry = YES;
  }
  NSDictionary *result = @{
    @"isBlur": @(isBlurry),
    @"maxLap": @(maxLap),
    @"threshold": @(threshold)

  };
  return result;
}

- (NSDictionary *)isImageBlurryCannyEdge:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
  cv::Mat cannyEdges;
  cv::Canny(matImageGrey, cannyEdges,  100, 150);
//  cv::Canny(matImageGrey, cannyEdges, 50, 150);

//   int totalPixels = matImageGrey.rows * matImageGrey.cols;
//   int edgePixels = 0;
//   for (int row = 0; row < matImageGrey.rows; row++) {
//     for (int col = 0; col < matImageGrey.cols; col++) {
//       if (cannyEdges.at<uchar>(row, col) != 0) {
//         edgePixels++;
//       }
//     }
//   }
  int totalPixels = matImageGrey.rows * matImageGrey.cols;
   int edgePixels = cv::countNonZero(cannyEdges);
  double edgeDensity = (double)edgePixels / totalPixels;
  double threshold =0.01;
   BOOL isBlurry = NO;
//  RCTLogInfo(@"edgePixels: %d", edgePixels);
//  RCTLogInfo(@"totalPixels: %d", totalPixels);
//  RCTLogInfo(@"edgeDensity: %f", edgeDensity);
  
   if (edgeDensity < threshold) {
     isBlurry = YES;
   }
  NSDictionary *result = @{
    @"isBlur": @(isBlurry),
    @"edgeDensity": @(edgeDensity),
    @"edgePixels": @(edgePixels),
    @"totalPixels": @(totalPixels),
    @"threshold": @(threshold)
  };
  return result;
}

- (NSDictionary *)isImageBlurryVarianceOfLaplacian:(UIImage *)image {
  BOOL isBlurry = NO;
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
//  cv::Mat blurredImage;
//    cv::GaussianBlur(matImageGrey, blurredImage, cv::Size(5,5), 0.0);
  cv::Mat laplacianImage;
  cv::Laplacian(matImageGrey, laplacianImage, CV_8U);
  cv::Scalar mean, stddev;
  cv::meanStdDev(laplacianImage, mean, stddev);
  double variance = stddev[0] * stddev[0];
//  RCTLogInfo(@"Laplacian Variance: %f", variance);
  double blurThreshold = 40.0; // Adjust as needed
  if (variance < blurThreshold) {
    isBlurry = YES;
  }
  NSDictionary *result = @{
    @"isBlur": @(isBlurry),
    @"variance": @(variance),
    @"blurThreshold": @(blurThreshold)
  };
  return  result;
}

- (BOOL)isImageBlurryMixed:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
  
  cv::Mat laplacianImage;
   cv::Laplacian(matImageGrey, laplacianImage, CV_8U);
   // Calculate mean and standard deviation of Laplacian values
   cv::Scalar mean, stddev;
   cv::meanStdDev(laplacianImage, mean, stddev);
   double variance = stddev[0] * stddev[0];
   // Threshold for blurriness (adjust as needed)
//   double blurThreshold = 20.0;
//  RCTLogInfo(@"variance: %f", variance);
  return  variance< 20;
//  cv::Mat cannyEdges;
//   cv::Canny(matImageGrey, cannyEdges, 50, 150);  // Adjust thresholds as needed
//
//   int totalPixels = matImageGrey.rows * matImageGrey.cols;
//   int edgePixels = 0;
//
//   for (int row = 0; row < matImageGrey.rows; row++) {
//     for (int col = 0; col < matImageGrey.cols; col++) {
//       if (cannyEdges.at<uchar>(row, col) != 0) {
//         edgePixels++;
//       }
//     }
//   }
//  double edgeDensity = (double)edgePixels / totalPixels;
//  // Here
//  
//  double varianceWeight = 0.7;  // Adjust weight as needed
//   double edgeDensityWeight = 1.0 - varianceWeight;
//
//   double blurrinessScore = varianceWeight * (1.0 - variance / 100.0) + edgeDensityWeight * edgeDensity;
//   double blurThreshold = 0.6;  // Adjust as needed
//
//   return blurrinessScore < blurThreshold;
//  
 
}

double calculateThresholdTenegrad(const cv::Mat& image) {
  // ... (คำนวณคุณสมบัติของภาพ เช่น ค่าเฉลี่ยความเข้มแสง)
  double averageIntensity = cv::mean(image)[0];
  // ปรับค่า `threshold` ตามคุณสมบัติของภาพ
  double threshold = 70.0;
  if (averageIntensity > 120.0) {
    threshold *= 1.2;
  } else if (averageIntensity < 80.0) {
    threshold *= 0.8;
  }
  return threshold;
}

- (UIImage *)convertCVMatToUIImage:(const cv::Mat&)cvMat {
  NSData *data = [NSData dataWithBytes:cvMat.data length:cvMat.elemSize() * cvMat.total()];
  CGColorSpaceRef colorSpace;
  
  if (cvMat.elemSize() == 1) {
    colorSpace = CGColorSpaceCreateDeviceGray();
  } else {
    colorSpace = CGColorSpaceCreateDeviceRGB();
  }
  
  CGDataProviderRef provider = CGDataProviderCreateWithCFData((__bridge CFDataRef)data);
  CGImageRef imageRef = CGImageCreate(cvMat.cols,                                   // Width
                                      cvMat.rows,                                   // Height
                                      8,                                            // Bits per component
                                      8 * cvMat.elemSize(),                         // Bits per pixel
                                      cvMat.step.p[0],                              // Bytes per row
                                      colorSpace,                                   // Colorspace
                                      kCGImageAlphaNone | kCGBitmapByteOrderDefault,// Bitmap info flags
                                      provider,                                     // CGDataProviderRef
                                      NULL,                                         // Decode
                                      false,                                        // Should interpolate
                                      kCGRenderingIntentDefault);                   // Intent
  
  UIImage *image = [UIImage imageWithCGImage:imageRef];
  
  CGImageRelease(imageRef);
  CGDataProviderRelease(provider);
  CGColorSpaceRelease(colorSpace);
  
  return image;
}

- (NSString *)encodeImageToBase64:(UIImage *)image {
  NSData *imageData = UIImagePNGRepresentation(image);
  return [imageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

- (NSString *)convertLaplacian:(UIImage *)image {
//  - (NSArray<NSString *> *)convertMydata:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
  
  cv::Mat dst2 = [self convertUIImageToCVMat:image];
  cv::Mat laplacianImage;
  cv::Mat abs_dst;
  dst2.convertTo(laplacianImage, CV_8UC1);
  
  // applying Laplacian operator to the image
  cv::Laplacian(matImageGrey, laplacianImage, CV_8U);
  cv::convertScaleAbs( laplacianImage, abs_dst );
//  UIImage *grayImage_1 = [self convertCVMatToUIImage:matImageGrey];
//  NSString *base64String_1 = [self encodeImageToBase64:grayImage_1];
  
  UIImage *laplacianImage_1 = [self convertCVMatToUIImage:abs_dst];
  NSString *base64String_2 = [self encodeImageToBase64:laplacianImage_1];
  
  return base64String_2;
}
- (NSDictionary *)convertMYImageFunction:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
  cv::Mat laplacianImage;
  cv::Laplacian(matImageGrey, laplacianImage, CV_8U);
  cv::Scalar mean, stddev;
  cv::meanStdDev(laplacianImage, mean, stddev);
  double variance = stddev[0] * stddev[0];
//  RCTLogInfo(@"Laplacian Variance: %f", variance);
//  RCTLogInfo(@"Laplacian stddev: %f", stddev[0]);
//  RCTLogInfo(@"Laplacian mean: %f", mean[0]);
  
  UIImage *laplacianImage_1 = [self convertCVMatToUIImage:laplacianImage];
  NSString *base64String_2 = [self encodeImageToBase64:laplacianImage_1];
  
  UIImage *matImageGrey_1 = [self convertCVMatToUIImage:matImageGrey];
  NSString *base64String_Grey = [self encodeImageToBase64:matImageGrey_1];
  NSDictionary *result = @{
    @"base64_one": base64String_2,
    @"base64_grey": base64String_Grey,
    @"variance": @(variance),
    @"stddev":@(stddev[0]) ,
    @"mean":@(mean[0])
  };
  return result;
}
- (NSDictionary *)ImageDetection:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
  // Reduce noise with Gaussian Blur
    cv::GaussianBlur(matImageGrey, matImageGrey, cv::Size(5, 5), 0);

    // Apply Canny Edge Detection
    cv::Mat edges;
    cv::Canny(matImageGrey, edges, 50, 150);

    // Use Hough Line Transform to detect lines
    std::vector<cv::Vec4i> lines;
    cv::HoughLinesP(edges, lines, 1, CV_PI / 180, 50, 50, 10);

    // Draw lines on the image
    cv::Mat resultImage = matImage.clone();
    for (size_t i = 0; i < lines.size(); i++) {
      cv::Vec4i l = lines[i];
      cv::line(resultImage, cv::Point(l[0], l[1]), cv::Point(l[2], l[3]), cv::Scalar(0, 255, 0), 2, cv::LINE_AA);
    }
  NSString *resultBase64 = [self encodeMatToBase64:resultImage];
  NSString *edgesimage = [self encodeMatToBase64:edges];
//  UIImage *resultUIImage = [self convertCVMatToUIImage:matImage];
//  NSString *base64String = [self encodeImageToBase64:resultUIImage];
  
//  UIImage *edgesUIImage = [self convertCVMatToUIImage:edges];
//  NSString *edgesBase64 = [self encodeImageToBase64:edgesUIImage];
 
  NSDictionary *result = @{
    @"database64": resultBase64,
    @"edgesBase64": edgesimage
  };
  return result;
}
- (NSString *)convertCannyEdge:(UIImage *)image {
  cv::Mat matImage = [self convertUIImageToCVMat:image];
   cv::Mat matImageGrey;
   cv::cvtColor(matImage, matImageGrey, cv::COLOR_BGRA2GRAY);
   cv::Mat cannyEdges;
   cv::Canny(matImageGrey, cannyEdges, 120, 150);  // Adjust thresholds as needed

   // Convert Canny edges to UIImage and encode to base64
   UIImage *cannyImage = [self convertCVMatToUIImage:cannyEdges];
   NSString *base64String = [self encodeImageToBase64:cannyImage];
   return base64String;
}

- (NSString *)encodeMatToBase64:(cv::Mat)mat {
  std::vector<uchar> buf;
  cv::imencode(".jpg", mat, buf);
  auto *enc_msg = reinterpret_cast<unsigned char*>(buf.data());
  NSData *data = [NSData dataWithBytes:enc_msg length:buf.size()];
  return [data base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}


@end
