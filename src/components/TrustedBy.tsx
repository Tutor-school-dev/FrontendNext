import Image from "next/image";
import startupIndiaHub from "../assets/startup-india-hub.png";
import startupBihar from "../assets/startup-bihar.png";
import brighterMinds from "../assets/brighter-minds.webp";
import gitopadesh from "../assets/gitopadesh.png";
import het from "../assets/het.png";
import cimpBiif from "../assets/cimp-biif.jpg";
import bhub from "../assets/bhub.jpg";

const TrustedBy = () => {
  const logos = [
    { name: "Startup India Hub", src: startupIndiaHub },
    { name: "Startup Bihar", src: startupBihar },
    { name: "Brighter Minds", src: brighterMinds },
    { name: "Gitopadesh", src: gitopadesh },
    { name: "HET", src: het },
    { name: "CIMP BIIF", src: cimpBiif },
    { name: "Bhub", src: bhub }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-lg font-semibold text-gray-800 mb-12">
          Trusted & Supported By
        </h3>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll items-center">
            {[...logos, ...logos].map((logo, index) => (
              <div 
                key={index}
                className="flex-shrink-0 mx-8 h-20 w-36 flex items-center justify-center"
              >
                <div className="h-full w-full flex items-center justify-center p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 logo-shine">
                  <Image
                    src={logo.src} 
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-all duration-300"
                    width={144}
                    height={80}
                    style={{
                      filter: 'brightness(1.2) contrast(1.15) saturate(1.25)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
