import { Upload, CheckCircle } from "lucide-react";
import React from "react";

interface FileButtonProps {
    label: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    fileName?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    capture?: "user" | "environment";
}

export function FileButton({ label, inputRef, fileName, onChange, capture }: FileButtonProps) {
    return (
        <div className="relative w-full">
            <div className={`border border-[#2B7CFF] rounded-[12px] py-[14px] text-center font-extrabold text-[#2B7CFF] cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 ${fileName ? "bg-blue-50" : "bg-white"}`}>
                {fileName ? (
                    <>
                        <CheckCircle size={18} />
                        已選擇檔案
                    </>
                ) : (
                    <>
                        <Upload size={18} />
                        {label}
                    </>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onChange}
                capture={capture}
            />
            {fileName && (
                <div className="text-xs text-[#6b7b80] mt-1 px-1 truncate">
                    {fileName}
                </div>
            )}
        </div>
    );
}
