////
////  OpenCVUtils.swift
////  expoimgcheck
////
////  Created by Sakchai Maneewong on 24/6/2567 BE.
////
//
//import Foundation
//import OpenCV2
////#include <opencv2/core.hpp>
////#include "opencv2/opencv.hpp"
//import React
//
//
//@objc(OpenCVUtils)
//class OpenCVUtils: NSObject {
//    // ... your functions here
//  func isImageBlurry(imagePath: String) -> Bool {
//      guard let image = cv2.imread(imagePath) else {
//          print("Error loading image")
//          return false
//      }
//
//      let gray = cv2.Mat()
//      cv2.cvtColor(image, gray, cv2.COLOR_RGB2GRAY, 0)
//
//      let dst = cv2.Mat()
//      let men = cv2.Mat()
//      let menO = cv2.Mat()
//      cv2.Laplacian(gray, dst, cv2.CV_64F, 1, 1, 0, cv2.BORDER_DEFAULT);
//      let meanStdDev = cv2.meanStdDev(dst, menO, men)
//      let laplacianValue = meanStdDev[0]
//
//      let blurThreshold = 10.0 // Adjust this value based on your needs
//
//      return laplacianValue > blurThreshold
//  }
//
//  
//}
