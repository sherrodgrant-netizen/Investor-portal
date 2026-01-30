"use client";

import { useState, useEffect } from "react";

export default function DocumentsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const documents = [
    {
      id: 1,
      name: "Non-Disclosure Agreement (NDA)",
      type: "NDA",
      dateSigned: "2024-01-15",
      status: "Signed",
      fileSize: "245 KB",
    },
    {
      id: 2,
      name: "Investment Agreement",
      type: "Contract",
      dateSigned: "2024-02-03",
      status: "Signed",
      fileSize: "1.2 MB",
    },
    {
      id: 3,
      name: "Property Purchase Agreement - Maple Street",
      type: "Contract",
      dateSigned: "2024-02-18",
      status: "Signed",
      fileSize: "890 KB",
    },
    {
      id: 4,
      name: "Investor Accreditation Form",
      type: "Form",
      dateSigned: "2024-01-10",
      status: "Signed",
      fileSize: "156 KB",
    },
    {
      id: 5,
      name: "Operating Agreement",
      type: "Contract",
      dateSigned: "2024-03-05",
      status: "Signed",
      fileSize: "678 KB",
    },
    {
      id: 6,
      name: "Tax Information - W-9 Form",
      type: "Form",
      dateSigned: "2024-01-12",
      status: "Signed",
      fileSize: "95 KB",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Signed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 ring-1 ring-green-200";
      case "Pending":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 ring-1 ring-yellow-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "NDA":
        return "🔒";
      case "Contract":
        return "📄";
      case "Form":
        return "📋";
      default:
        return "📎";
    }
  };

  return (
    <div>
      {/* Page Header with animation */}
      <div
        className={`mb-8 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900">Documents</h2>
        <p className="text-gray-600 mt-2">
          View and download your signed documents
        </p>
      </div>

      {/* Documents List with animation */}
      <div
        className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid md:grid-cols-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700">
          <div className="col-span-2">Document Name</div>
          <div>Type</div>
          <div>Date Signed</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Documents with stagger animation */}
        <div className="divide-y divide-gray-200">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className={`p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{
                transitionDelay: `${200 + index * 80}ms`,
              }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {getTypeIcon(doc.type)}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {doc.type} • {doc.fileSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Signed: {formatDate(doc.dateSigned)}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      ✓ {doc.status}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-slate-900 to-purple-900 text-white text-sm rounded-lg hover:from-purple-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md">
                    Download
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-6 md:items-center">
                <div className="col-span-2 flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {getTypeIcon(doc.type)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.fileSize}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">{doc.type}</div>
                <div className="text-sm text-gray-700">
                  {formatDate(doc.dateSigned)}
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      doc.status
                    )}`}
                  >
                    ✓ {doc.status}
                  </span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-gradient-to-r from-slate-900 to-purple-900 text-white text-sm rounded-lg hover:from-purple-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats with stagger animation */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="text-sm text-gray-600 mb-1">Total Documents</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {documents.length}
          </p>
        </div>
        <div
          className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <p className="text-sm text-gray-600 mb-1">Signed Documents</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {documents.filter((d) => d.status === "Signed").length}
            </p>
            <span className="text-2xl">✓</span>
          </div>
        </div>
        <div
          className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <p className="text-sm text-gray-600 mb-1">Latest Signature</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDate(documents[documents.length - 1].dateSigned)}
          </p>
        </div>
      </div>
    </div>
  );
}
