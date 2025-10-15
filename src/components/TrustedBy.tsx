const TrustedBy = () => {
  const logos = [
    "Startup India Hub",
    "Startup Bihar",
    "Brighter Minds",
    "Gitopadesh",
    "HET",
    "CIMP BIIF",
    "Bhub"
  ];
  
  return (
    <section className="py-16 bg-background border-y">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted & Supported By
        </h3>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {[...logos, ...logos].map((logo, index) => (
              <div 
                key={index}
                className="flex-shrink-0 mx-8 h-16 w-32 flex items-center justify-center"
              >
                <div className="h-full w-full bg-muted/50 rounded-lg flex items-center justify-center border">
                  <span className="text-xs font-medium text-muted-foreground text-center px-2">
                    {logo}
                  </span>
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
