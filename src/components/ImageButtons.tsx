"use client";

import { Button } from "@/components/ui/button";
import { Download, MessageSquareMore, ThumbsUp } from "lucide-react";
import { useState } from "react";

const ImageButtons = () => {
  const [numLikes, setNumLikes] = useState(0);

  return (
    <div className="flex gap-5">
      <div>
        <Button
          className="space-x-2 mr-2"
          size={"icon"}
          onClick={() => setNumLikes(numLikes + 1)}
        >
          <ThumbsUp />
        </Button>
        <span>{numLikes}</span>
      </div>

      <Button
        size={"icon"}
        onClick={() => {
          const commentBar = document.getElementById("comment-bar");
          commentBar?.focus();
        }}
      >
        <MessageSquareMore />
      </Button>

      <a href="/test/sample1.jpg" download="sample1.jpg">
        <Button size={"icon"}>
          <Download className="w-5 h-5" />
        </Button>
      </a>

      <Button>Save</Button>
    </div>
  );
};

export default ImageButtons;
