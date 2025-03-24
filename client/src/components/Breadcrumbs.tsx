import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Skill } from "@/lib/types";

interface BreadcrumbsProps {
  items: Skill[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return (
      <ol className="flex flex-wrap items-center text-sm text-gray-600">
        <li className="breadcrumb-item">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>
      </ol>
    );
  }
  
  return (
    <ol className="flex flex-wrap items-center text-sm text-gray-600">
      <li className="breadcrumb-item">
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <span className="mx-2 text-gray-400"><ChevronRight className="inline-block w-4 h-4" /></span>
      </li>
      
      {items.map((item, index) => (
        <li key={item.id} className="breadcrumb-item">
          {index < items.length - 1 ? (
            <>
              <button 
                onClick={() => {/* Handle navigation to this breadcrumb */}}
                className="text-blue-600 hover:underline"
              >
                {item.name}
              </button>
              <span className="mx-2 text-gray-400"><ChevronRight className="inline-block w-4 h-4" /></span>
            </>
          ) : (
            <span className="text-gray-800 font-medium">{item.name}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
