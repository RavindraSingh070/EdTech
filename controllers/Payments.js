// const {instance} = require("../config/razorpay");
// const Course = require("../models/Course");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
// const  mongoose  = require("mongoose");

// //capture the paymnet and initiate the razorpay

// exports.capturePayment = async (req , res ) => {
    
//         //fetch course id and user id
//         const {course_id} = req.body;
//         const userId = req.user.id;
//         //validation on 
//         if (!course_id) {
//             return res.json({
//                 success:false,
//                 message: "Please provide valid course id.",
//             });
//         }
        
//         //valid courseid



//         let course;

//         //valid course details

//         try {
//             course = await Course.findById(course_id);
//             if(!course)
//             {
//                 return res.json({
//                     success:false,
//                     message:"Could not find the Course",
//                 });
//             }

//             //user already pay for the same course

//             const uid = new mongoose.Types.ObjectId(userId);
//             //user already endrolled on it
//             if(course.studentsEnrolled.includes(uid))
//             {
//                 return res.status(200).json({
//                     success:false,
//                     message:"Student is already enrolled"
//                 })
//             }

//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
        
        
//         // order create 
//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 course_id:course_id,
//                 user:id,
//             },
//         };
//         try {
//             //initaite the paymnet using razorpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);


//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId: paymentResponse.id,
//             courrency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });


//         } catch (error) {
//             console.log(error)
//             return res.json({
//                 success:false,
//                 message:"Could not initiale order."
//             })
//         }
// }

// //verify signature 

// exports.verifySignature = async ( req ,res ) => {
    
//     const webhookSecret="123456789";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webhookSecret);

//     shasum.update(JSON.stringify(req.body));

//     const digest = shasum.digest("hex");


//     if (signature === digest) {
//         console.log("Payemnt is AUthorized");

//         const {courseId,userId} = req.body.paylaod.payment.entity.notes;

//         try {
//             //fufill
//             //find the course and enrool it in
//             const enrolledCourse = await Course.findOneAndUpdate
//                                                                 (
//                                                                     {_id:courseId},
//                                                                 {
//                                                                     $push:{
//                                                                         studentsEnrolled: userId,
//                                                                     }
//                                                                 },
//                                                                 {new:true},
//             )

//             if(!enrolledCourse)
//             {
//                 return res.status(500).json({
//                     success:false,
//                     message:"Corse not found",
//                 })
//             }

//             console.log(enrolledCourse);

//             //find the studnet and add the course to list of enrolled coursese

//             const enrolledStudent = await User.findOneAndUpdate(
//                                                                 {_id:userId},
//                                                                 {
//                                                                     $push:{
//                                                                         courses:courseId,
//                                                                     },
//                                                                 },
//                                                                 {
//                                                                     new:true,
//                                                                 }
//             )

//             //mail send
//              const emailRespone = await mailSender(
//                 enrolledStudent.email,
//                 "congrattulation from studynotion",
//                 "ongrattulation you are onboraded into coursese"
//              );
//              console.log(emailRespone);

//              return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and course Added",

//              })
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             })
//         }
//     }
//     else
//     {
//         return res.status(400).json({
//             success:false,
//             message:"Invalid request"
//         });
//     }
// };