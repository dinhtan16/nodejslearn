import db from "../../models";

export const getOneUser = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id },
        attributes: { exclude: ["password",'role_code'] }, //kh trả về password
        include:[
          {
            model:db.Role,as:'roleData',
            attributes:['id','code','value'] //lấy data tương ứng
          }
        ] //lấy data từ khóa ngoại, bắt buộc có alias => as
    
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "Thanh cong" : "tim user that bai",
        userData: response,
      });
    } catch (error) {
      // console.log(error)
      reject(error);
    }
  });


  export const updateUser = ({id,...body},fileData) =>
  new Promise(async (resolve, reject) => {
      try {
        // nếu sửa ảnh thì ghi đè ảnh cũ, còn không thì giữ nguyên không up => check nếu có
        //fileDaa thì ghi đè
         if(fileData) body.avatar = fileData?.path
        //  if(fileData) body.fileName = fileData?.filename
          //obj1 : cái mình muốn sửa
          //obj2 : condition
        const response = await db.User.update(body,{
          where:{id},
        });
        //response update trả về số lượng sách đã update
        resolve({
          err: response[0] > 0 ? 0 : 1,
          msg: response[0] > 0 ? "cap nhat Thanh cong" : " cap nhat user that bai/ hoac Id sai",
        });
        if(fileData && response[0] === 0) cloudinary.uploader.destroy(fileData.filename)
      } catch (error) {
        reject(error);
        if(fileData) cloudinary.uploader.destroy(fileData.filename)

      }
      
    });
