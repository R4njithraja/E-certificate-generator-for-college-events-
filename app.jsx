import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { DownloadIcon, PrintIcon } from './components/Icons.jsx';

// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [studentName, setStudentName] = useState('JANE DOE');
    const [eventName, setEventName] = useState('NATIONAL LEVEL TECHNICAL SYMPOSIUM');
    const [collegeName, setCollegeName] = useState('TECH UNIVERSITY');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [certificateType, setCertificateType] = useState('Certificate of Participation');
    
    // Authority Signature State
    const [signature, setSignature] = useState(null);
    const [signatureName, setSignatureName] = useState('Dr. Alan Smith');
    const [signatureTitle, setSignatureTitle] = useState('Head of Department');

    // Coordinator Signature State
    const [coordinatorSignature, setCoordinatorSignature] = useState(null);
    const [coordinatorName, setCoordinatorName] = useState('Prof. Susan Jones');
    const [coordinatorTitle, setCoordinatorTitle] = useState('Staff Coordinator');

    const [showCertificate, setShowCertificate] = useState(false);
    
    // --- Refs for adaptive text ---
    const certificateRef = useRef(null);
    const collegeNameRef = useRef(null);
    const studentNameRef = useRef(null);
    const eventNameRef = useRef(null);

    // Effect to adjust font sizes when certificate is shown or text changes
    useEffect(() => {
        const adjustFontSize = (element, maxFontSize, minFontSize, step = 1) => {
            if (!element) return;
            let currentSize = maxFontSize;
            element.style.fontSize = `${currentSize}px`;
            element.style.lineHeight = `${currentSize * 1.2}px`;
            while (element.scrollWidth > element.offsetWidth && currentSize > minFontSize) {
                currentSize -= step;
                element.style.fontSize = `${currentSize}px`;
                element.style.lineHeight = `${currentSize * 1.2}px`;
            }
        };

        if (showCertificate) {
            setTimeout(() => {
                adjustFontSize(collegeNameRef.current, 40, 24);
                adjustFontSize(studentNameRef.current, 36, 18);
                adjustFontSize(eventNameRef.current, 22, 14);
            }, 100);
        }
    }, [showCertificate, collegeName, studentName, eventName]);


    // --- Handlers ---
    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (studentName && eventName && collegeName && date && certificateType) {
            setShowCertificate(true);
        } else {
            alert('Please fill in all the required fields.');
        }
    };
    
    const handleDownload = () => {
        if (certificateRef.current) {
            html2canvas(certificateRef.current, {
                scale: 2, useCORS: true, backgroundColor: '#ffffff',
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `Certificate_${studentName.replace(/ /g, '_')}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    const handlePrint = () => {
        const printContent = certificateRef.current;
        const printWindow = window.open('', '', 'left=50000,top=50000,width=0,height=0');
        printWindow.document.write(`
            <html><head><title>Print Certificate</title>
            <style>
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { margin: 0; -webkit-print-color-adjust: exact; color-adjust: exact; }
                    .certificate-container { page-break-after: always; display: block !important; }
                }
            </style>
            </head><body>${printContent.outerHTML}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 1000);
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">E-Certificate Generator</h1>
                    <p className="text-md text-gray-600 mt-2">Create and customize certificates for your college events.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* --- FORM SECTION --- */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Certificate Details</h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="studentName" className="block text-sm font-medium text-gray-600 mb-1">Student Name</label>
                                            <input type="text" id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                                        </div>
                                        <div>
                                            <label htmlFor="collegeName" className="block text-sm font-medium text-gray-600 mb-1">College/University Name</label>
                                            <input type="text" id="collegeName" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-600 mb-1">Event Name</label>
                                        <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">Event Date</label>
                                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                                        </div>
                                        <div>
                                            <label htmlFor="certificateType" className="block text-sm font-medium text-gray-600 mb-1">Certificate Type</label>
                                            <select id="certificateType" value={certificateType} onChange={(e) => setCertificateType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                                <option>Certificate of Participation</option>
                                                <option>Certificate of Achievement</option>
                                                <option>Winner's Certificate</option>
                                                <option>Volunteer Certificate</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-6 border-b pb-2">Signatories</h3>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t pt-4">
                                        <div>
                                            <label htmlFor="signatureName" className="block text-sm font-medium text-gray-600 mb-1">Authority Name</label>
                                            <input type="text" id="signatureName" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="signatureTitle" className="block text-sm font-medium text-gray-600 mb-1">Authority Title</label>
                                            <input type="text" id="signatureTitle" value={signatureTitle} onChange={(e) => setSignatureTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Authority Signature</label>
                                            <input type="file" id="signature" onChange={(e) => handleFileChange(e, setSignature)} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t pt-4">
                                        <div>
                                            <label htmlFor="coordinatorName" className="block text-sm font-medium text-gray-600 mb-1">Staff Coordinator Name</label>
                                            <input type="text" id="coordinatorName" value={coordinatorName} onChange={(e) => setCoordinatorName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="coordinatorTitle" className="block text-sm font-medium text-gray-600 mb-1">Coordinator Title</label>
                                            <input type="text" id="coordinatorTitle" value={coordinatorTitle} onChange={(e) => setCoordinatorTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Coordinator Signature</label>
                                            <input type="file" id="coordinatorSignature" onChange={(e) => handleFileChange(e, setCoordinatorSignature)} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105">
                                Generate Certificate
                            </button>
                        </form>
                    </div>

                    {/* --- CERTIFICATE PREVIEW SECTION --- */}
                    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Preview</h2>
                        {showCertificate ? (
                            <>
                                <div id="certificate-wrapper" className="w-full aspect-[1.414/1] overflow-hidden">
                                  <div ref={certificateRef} className="certificate-container p-10 w-full h-full bg-white flex flex-col justify-center items-center gap-y-4" style={{ fontFamily: "'Times New Roman', serif", border: '10px solid #1e3a8a', backgroundImage: "url('https://www.transparenttextures.com/patterns/subtle-grunge.png')"}}>
                                      <div className="text-center">
                                          <h1 ref={collegeNameRef} className="font-bold text-blue-900 whitespace-nowrap" style={{fontFamily:"'Garamond', serif"}}>{collegeName.toUpperCase()}</h1>
                                          <p className="text-lg mt-2 text-gray-600">presents this</p>
                                      </div>
                                      <div className="text-center">
                                          <h2 className="text-3xl font-semibold text-amber-600 tracking-wider">{certificateType}</h2>
                                      </div>
                                      <div className="text-center">
                                          <p className="text-md text-gray-700 mb-2">This certificate is proudly presented to</p>
                                          <p ref={studentNameRef} className="font-bold text-blue-900 whitespace-nowrap" style={{ fontFamily: "'Brush Script MT', cursive" }}>{studentName}</p>
                                          <p className="text-md text-gray-700 mt-3">for their valuable contribution and active participation in the</p>
                                          <p ref={eventNameRef} className="font-semibold text-gray-800 mt-2 whitespace-nowrap">{eventName}</p>
                                          <p className="text-md text-gray-700 mt-1">held on {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                                      </div>
                                      <div className="flex justify-between items-end w-full mt-auto pt-6">
                                          <div className="text-center">
                                              {coordinatorSignature && <img src={coordinatorSignature} alt="Coordinator Signature" className="h-14 mx-auto" />}
                                              <p className="border-t-2 border-gray-600 mt-2 pt-1 px-8 font-semibold text-sm">{coordinatorName}</p>
                                              <p className="text-xs text-gray-600">{coordinatorTitle}</p>
                                          </div>
                                          <div className="text-center">
                                              {signature && <img src={signature} alt="Authority Signature" className="h-14 mx-auto" />}
                                              <p className="border-t-2 border-gray-600 mt-2 pt-1 px-8 font-semibold text-sm">{signatureName}</p>
                                              <p className="text-xs text-gray-600">{signatureTitle}</p>
                                          </div>
                                      </div>
                                  </div>
                                </div>
                                <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    <button onClick={handleDownload} className="flex-1 inline-flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300">
                                        <DownloadIcon /> Download as PNG
                                    </button>
                                    <button onClick={handlePrint} className="flex-1 inline-flex items-center justify-center bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300">
                                        <PrintIcon /> Print Certificate
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full aspect-[1.414/1] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-gray-500 text-center">Your certificate will be displayed here once generated.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
