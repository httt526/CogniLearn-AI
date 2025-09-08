import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { TbShieldCheck } from 'react-icons/tb';
import landing from '../../assets/landing.png';
import landing2 from '../../assets/landing2.png';

// --- CÁC COMPONENT TÁI SỬ DỤNG ---

const SolutionCard = ({ title, description, buttonText }) => (
    <div className="relative group">
        {/* Lớp nền xanh đóng vai trò là bóng/viền, dịch sang phải và xuống dưới */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#0367B0] rounded-2xl transform translate-x-2 translate-y-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:translate-y-1"></div>

        {/* Thẻ nội dung màu trắng */}
        <div className="relative bg-white rounded-2xl p-6 h-full flex flex-col border-2 border-gray-200">
            <h3 className="text-lg font-bold text-[#112D4E] mb-3 text-left">{title}</h3>
            <p className="text-gray-600 text-[15px] mb-5 flex-grow text-left">{description}</p>
            <div className="mt-auto text-center">
                <button className="bg-[#0367B0] text-white font-semibold py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors duration-300 hover:scale-105 cursor-pointer">
                {buttonText}
                </button>
            </div>
        </div>
    </div>
);

const BenefitItem = ({ icon, text }) => (
    <div className="text-center flex flex-col items-center p-4">
        {icon}
        <p className="mt-3 text-gray-700 max-w-[200px] text-sm">{text}</p>
    </div>
);


// --- CÁC PHẦN CỦA TRANG (SECTIONS) ---

const Header = () => (
  <header className="absolute top-4 left-0 right-5 z-20 py-5 px-4 sm:px-8">
    <div className="container mx-auto flex justify-between items-center">
      <div> {/* Empty div for spacing */} </div>
      <div className="flex items-center space-x-4">
        <a href="#" className="text-gray-700 hover:text-[#0367B0]">Đã có tài khoản? Đăng nhập</a>
        <button className="bg-[#0367B0] text-white font-semibold py-2 cursor-pointer px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-300 transform hover:scale-105">
          ĐĂNG KÍ
        </button>
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="relative bg-[#FBFBFB] pt-32 pb-20 overflow-hidden min-h-[930px] flex items-center justify-center">
    <div className="absolute top-[-300px] left-0 w-full h-full" style={{ backgroundImage: `url(${landing})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
    <div className="container mx-auto top-[-150px] text-center relative z-10">
      <h2 className="text-5xl md:text-7xl font-extrabold text-[#112D4E]">
        CogniLearn AI
      </h2>
      <p className="text-lg text-[#112D4E] mt-4 mb-8">
        Hiểu tư duy, mở khóa tương lai
      </p>
      <button className="bg-[#112D4E] cursor-pointer text-white font-bold py-3 px-8 rounded-lg text-base hover:bg-opacity-90 transition-colors duration-300 transform hover:scale-105">
        TÌM HIỂU NGAY
      </button>
    </div>
  </section>
);

const PersonalizationSection = () => (
  <section className="relative py-20 top-[-120px] bg-cover bg-center bg-[#112D4E] flex items-center min-h-[300px]" >
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="mx-auto text-center relative z-10 px-[10%] sm:px-[15%] lg:px-[20%]">
      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
        Cá nhân hóa học tập & hướng nghiệp bằng AI phân tích quá trình tư duy
      </h2>
      <p className="text-base text-gray-200 max-w-3xl mx-auto mt-5 mb-8">
        Không chỉ chấm điểm, CogniLearn AI đo lường và phân tích cách bạn suy nghĩ để thiết kế lộ trình học và nghề nghiệp chuẩn xác – dành riêng cho bạn.
      </p>
    </div>
  </section>
);

const SolutionsSection = () => (
  <section className="py-20 bg-[#FBFBFB]">
    <div className="container mx-auto px-4 top-[-20px] relative z-10">
      <h2 className="text-4xl font-bold text-center text-[#112D4E] mb-16">Giải pháp của CogniLearn AI</h2>
      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        <SolutionCard
          title="Phân tích nhận thức vĩ mô"
          description="AI đo lường tốc độ, chiến lược giải quyết vấn đề, mức độ trừu tượng... để hiểu sâu cách bạn học."
          buttonText="BẮT ĐẦU NGAY"
        />
        <SolutionCard
          title="Bản đồ nhận thức cá nhân"
          description="Trực quan hóa điểm mạnh – điểm yếu tư duy để định hướng học tập."
          buttonText="TRẢI NGHIỆM NGAY"
        />
        <SolutionCard
          title="Cá nhân hóa học tập và hướng nghiệp"
          description="Gợi ý nội dung, bài tập, và nghề nghiệp phù hợp dựa trên dữ liệu nhận thức."
          buttonText="TÌM HIỂU NGAY"
        />
      </div>
    </div>
  </section>
);

const BenefitsSection = () => (
    <section className="relative bg-[#FBFBFB] pt-32 pb-20 overflow-hidden min-h-[930px] flex items-center justify-center">
        <div className="absolute w-[200vw] h-[100vh] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <div 
            className="absolute top-[-70px] w-[33%] h-[100%] transition-all duration-300 ease-in-out left-[-10rem] sm:left-[-5rem] md:left-16 lg:left-36" 
            style={{ backgroundImage: `url(${landing})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'rotate(-90deg)' }}>
          </div>
          <div 
            className="absolute top-[-70px] w-[33%] h-[100%] transition-all duration-300 ease-in-out right-[-10rem] sm:right-[-5rem] md:right-16 lg:right-36" 
            style={{ backgroundImage: `url(${landing})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'rotate(90deg)' }}>
          </div>
        </div>
        <div className="container top-[-180px] mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#112D4E] mb-16">Lợi ích khi sử dụng</h2>
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 max-w-2xl mx-auto">
                <BenefitItem icon={<FiEdit className='text-[#0367B0] text-3xl'/>} text={<p className='text-[16px]'>Hiểu rõ điểm mạnh & điểm yếu tư duy của bản thân.</p>} />
                <BenefitItem icon={<AiOutlineClockCircle className='text-[#0367B0] text-3xl' />} text={<p className='text-[16px]'>Rút ngắn thời gian học, tập trung đúng chỗ cần cải thiện.</p>} />
                <BenefitItem icon={<HiOutlineUserGroup className='text-[#0367B0] text-3xl' />} text={<p className='text-[16px]'>Lựa chọn ngành nghề phù hợp, giảm rủi ro 'học sai - làm sai'.</p>} />
                <BenefitItem icon={<TbShieldCheck className='text-[#0367B0] text-3xl' />} text={<p className='text-[16px]'>Bảo mật thông tin tuyệt đối - không cần camera, micro.</p>} />
            </div>
        </div>
    </section>
);

const HowItWorksSection = () => (
    <section className="relative py-20 top-[0px] bg-cover bg-center bg-[#112D4E] flex items-center min-h-[400px]">
        <div className="absolute inset-0 bg-[#112D4E] opacity-80"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h2 className="text-4xl font-bold mb-8">Cách hoạt động</h2>
            <div className="space-y-4 text-lg max-w-2xl mx-auto">
                <p className='hover:text-[#C6E7FF] hover:text-[19px] cursor-pointer'>Học tập và làm bài kiểm tra trên nền tảng CogniLearn AI →</p>
                <p className='hover:text-[#C6E7FF] hover:text-[19px] cursor-pointer'>AI phân tích dữ liệu tư duy từ cách bạn xử lý từng câu hỏi →</p>
                <p className='hover:text-[#C6E7FF] hover:text-[19px] cursor-pointer'>Nhận báo cáo nhận thức cá nhân với biểu đồ và phân tích chi tiết →</p>
                <p className='hover:text-[#C6E7FF] hover:text-[19px] cursor-pointer'>Nhận lộ trình học & gợi ý nghề nghiệp tối ưu cho bạn →</p>
            </div>
        </div>
    </section>
);

const CTASection = () => (
    <section className="bg-[#FBFBFB] py-20 z-20">
        <div className="container  mx-auto text-center px-4 min-h-[350px] flex flex-col justify-center items-center">
            <h2 className="text-2xl md:text-2xl font-semibold text-[#112D4E] max-w-3xl mx-auto leading-snug">
                Sẵn sàng khám phá bản đồ tư duy của chính mình? <br/> Hãy để CogniLearn AI đồng hành cùng bạn trên hành trình học tập và sự nghiệp.
            </h2>
            <button className="mt-8 bg-[#0367B0] z-30 cursor-pointer text-white font-bold py-3 px-8 rounded-lg text-base hover:bg-opacity-90 transition-colors duration-300 transform hover:scale-105">
                BẮT ĐẦU MIỄN PHÍ NGAY BÂY GIỜ
            </button>
        </div>
    </section>
);

const Footer = () => (
    <footer className=" text-[#112D4E] relative bg-[#FBFBFB] min-h-[600px]">
      <div className="absolute bottom-[0px] left-0 w-full h-[150%] z-0" style={{ backgroundImage: `url(${landing2})`, backgroundSize: 'cover', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat' }}></div>
        <div className="container mx-auto relative px-25 z-10 bottom-[-320px] py-20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                 <div className="col-span-2 md:col-span-1">
                    <h4 className="font-bold text-lg mb-4">COGNILEARN AI</h4>
                    {/* Social media icons can be added here */}
                </div>
                <div>
                    <h5 className="font-semibold text-[#112D4E] mb-4">Topic</h5>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white">Page</a></li>
                        <li><a href="#" className="hover:text-white">Page</a></li>
                        <li><a href="#" className="hover:text-white">Page</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-[#112D4E] mb-4">Topic</h5>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white">Page</a></li>
                        <li><a href="#" className="hover:text-white">Page</a></li>
                        <li><a href="#" className="hover:text-white">Page</a></li>
                    </ul>
                </div>
                 <div>
                    <h5 className="font-semibold text-[#112D4E] mb-4">Topic</h5>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white">Page</a></li>
                        <li><a href="#" className="hover:text-white">Page</a></li>
                        <li><a href="#" className="hover:text-white">Page</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
);

// --- COMPONENT CHÍNH CỦA TRANG ---
function App() {
  return (
    <div className="bg-white lexend">
      <Header />
      <HeroSection />
      <main>
        <PersonalizationSection />
        <SolutionsSection />
        <BenefitsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;



