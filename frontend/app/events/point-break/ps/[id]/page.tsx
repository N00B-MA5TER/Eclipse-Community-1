"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const psData: Record<string, { title: string, index: string, slides: any[] }> = {
  "1": {
    title: "THE PRESENTATION FROM HELL",
    index: "01",
    slides: [
  {
    id: "situation",
    label: "THE SITUATION",
    labelColor: "text-[#00e5ff]",
    borderColor: "border-[#00e5ff]",
    content: (
      <div className="flex flex-col gap-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
          Your team has a project presentation tomorrow at <span className="text-[#00e5ff]">10:00 AM</span>.
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
          There are <span className="text-[#00e5ff] font-bold">four</span> team members:
        </p>
        <div className="flex flex-col gap-4 mt-4 font-mono-code text-lg">
          <div className="flex gap-6 items-start">
            <span className="text-[#b300ff] font-bold text-xl">A</span>
            <span className="text-white">Has written most of the code but has not prepared the presentation.</span>
          </div>
          <div className="flex gap-6 items-start">
            <span className="text-[#b300ff] font-bold text-xl">B</span>
            <span className="text-white">Created most of the slides but does not understand the implementation well.</span>
          </div>
          <div className="flex gap-6 items-start">
            <span className="text-[#b300ff] font-bold text-xl">C</span>
            <span className="text-white">Understands the technical implementation but has not reviewed the final slides.</span>
          </div>
          <div className="flex gap-6 items-start">
            <span className="text-[#b300ff] font-bold text-xl">D</span>
            <span className="text-white">Contributed very little and only understands the basic idea of the project.</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "presentation",
    label: "THE PRESENTATION",
    labelColor: "text-[#00e5ff]",
    borderColor: "border-[#00e5ff]",
    content: (
      <div className="flex flex-col gap-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
          The presentation must contain:
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mt-4 font-mono-code text-xl text-white font-medium">
          <div className="flex gap-4 items-center">
            <span className="text-[#b300ff]">1</span>
            <span>Problem statement</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[#b300ff]">2</span>
            <span>Approach</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[#b300ff]">3</span>
            <span>Implementation</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[#b300ff]">4</span>
            <span>Live / demo explanation</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[#b300ff]">5</span>
            <span>Results</span>
          </div>
        </div>
        <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-8">
          You have <span className="text-[#00e5ff] font-bold">3 hours tonight</span> to prepare.
        </p>
      </div>
    )
  },
  {
    id: "challenge",
    label: "THE CHALLENGE",
    labelColor: "text-[#b300ff]",
    borderColor: "border-[#b300ff]",
    content: (
      <div className="flex flex-col gap-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
          Create a preparation plan for the next 3 hours.
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
          Your plan must specify:
        </p>
        <div className="flex flex-col gap-4 mt-4 font-mono-code text-xl text-white font-medium ml-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
            <span>What each member does</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
            <span>How the presentation is divided</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
            <span>How the team handles the demo</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "overview",
    label: "",
    labelColor: "hidden",
    borderColor: "hidden",
    content: (
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
        {/* Column 1 */}
        <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
          <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
            <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
            <span className="text-[#00e5ff]">THE SITUATION</span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight font-heading">
            Your team has a project presentation tomorrow at <span className="text-[#00e5ff]">10:00 AM</span>.
          </h2>
          <p className="text-sm text-gray-300 font-mono-code mt-2">
            There are <span className="text-[#00e5ff] font-bold">four</span> team members:
          </p>
          <div className="flex flex-col gap-3 mt-2 font-mono-code text-xs">
            <div className="flex gap-4 items-start">
              <span className="text-[#b300ff] font-bold">A</span>
              <span className="text-white">Has written most of the code but has not prepared the presentation.</span>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-[#b300ff] font-bold">B</span>
              <span className="text-white">Created most of the slides but does not understand the implementation well.</span>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-[#b300ff] font-bold">C</span>
              <span className="text-white">Understands the technical implementation but has not reviewed the final slides.</span>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-[#b300ff] font-bold">D</span>
              <span className="text-white">Contributed very little and only understands the basic idea of the project.</span>
            </div>
          </div>
        </div>
        
        {/* Column 2 */}
        <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
          <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
            <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
            <span className="text-[#00e5ff]">THE PRESENTATION</span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight font-heading">
            The presentation must contain:
          </h2>
          <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium">
            <div className="flex gap-4 items-center">
              <span className="text-[#b300ff]">1</span>
              <span>Problem statement</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[#b300ff]">2</span>
              <span>Approach</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[#b300ff]">3</span>
              <span>Implementation</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[#b300ff]">4</span>
              <span>Live / demo explanation</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[#b300ff]">5</span>
              <span>Results</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-mono-code mt-4">
            You have <span className="text-[#00e5ff] font-bold">3 hours tonight</span> to prepare.
          </p>
        </div>

        {/* Column 3 */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
            <div className="w-6 h-[2px] bg-[#b300ff]"></div>
            <span className="text-[#b300ff]">THE CHALLENGE</span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight font-heading">
            Create a preparation plan for the next 3 hours.
          </h2>
          <p className="text-sm text-gray-300 font-mono-code mt-2">
            Your plan must specify:
          </p>
          <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
              <span>What each member does</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
              <span>How the presentation is divided</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
              <span>How the team handles the demo</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
    ]
  },
  "2": {
    title: "THE PERFECT MODEL THAT DOESN'T WORK",
    index: "02",
    slides: [
      {
        id: "situation",
        label: "THE SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your team has developed an ML model for identifying patients at <span className="text-[#00e5ff]">high risk</span> of a disease.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              Your test dataset contains:
            </p>
            <div className="mt-2 font-mono-code text-lg border-t border-[#333] pt-2 w-full max-w-md">
              <div className="flex justify-between text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">
                <span>Class</span>
                <span>Patients</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span className="font-bold">Low Risk</span>
                <span className="text-[#00e5ff] font-bold">900</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span className="font-bold">High Risk</span>
                <span className="text-[#00e5ff] font-bold">100</span>
              </div>
              <div className="flex justify-between text-white py-2 mt-1">
                <span className="font-bold">Total</span>
                <span className="text-[#00e5ff] font-bold">1000</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "result",
        label: "THE RESULT",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-8 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              The model correctly classifies <span className="text-[#00e5ff]">970 out of 1000</span> patients. Therefore, its reported accuracy is <span className="text-[#00e5ff]">97%</span>.
            </h1>
            <div className="flex flex-col mt-2">
              <span className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#b300ff] to-[#00e5ff] font-heading leading-none">97%</span>
              <span className="text-[#00e5ff] font-mono-code font-bold tracking-widest uppercase text-sm mt-2">Reported Accuracy</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4 leading-relaxed">
              Your demonstration is tomorrow, in front of a <span className="text-[#00e5ff] font-bold">hospital review committee</span> that will decide whether to use the model on real patients. You may make <span className="text-[#00e5ff] font-bold">one major change</span> to the model or evaluation before the demonstration.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Decide:
            </h1>
            <div className="flex flex-col gap-4 mt-4 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Whether the model is ready to present</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Whether the model needs to be changed</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>What claims you can responsibly make</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Your team has developed an ML model for identifying patients at <span className="text-[#00e5ff]">high risk</span> of a disease.
              </h2>
              <p className="text-sm text-gray-300 font-mono-code mt-2 mb-1">
                Your test dataset contains:
              </p>
              <div className="font-mono-code text-xs border-t border-[#333] pt-2 w-full">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">
                  <span>Class</span>
                  <span>Patients</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1.5">
                  <span className="font-bold">Low Risk</span>
                  <span className="text-[#00e5ff] font-bold">900</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1.5">
                  <span className="font-bold">High Risk</span>
                  <span className="text-[#00e5ff] font-bold">100</span>
                </div>
                <div className="flex justify-between text-white py-1.5 mt-0.5">
                  <span className="font-bold">Total</span>
                  <span className="text-[#00e5ff] font-bold">1000</span>
                </div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE RESULT</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                The model correctly classifies <span className="text-[#00e5ff]">970 out of 1000</span> patients. Therefore, its reported accuracy is <span className="text-[#00e5ff]">97%</span>.
              </h2>
              <div className="flex flex-col mt-2">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#b300ff] to-[#00e5ff] font-heading leading-none">97%</span>
                <span className="text-[#00e5ff] font-mono-code font-bold tracking-widest uppercase text-[10px] mt-1">Reported Accuracy</span>
              </div>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                Your demonstration is tomorrow, in front of a <span className="text-[#00e5ff]">hospital review committee</span> that will decide whether to use the model on real patients. You may make <span className="text-[#00e5ff]">one major change</span> to the model or evaluation before the demonstration.
              </p>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Decide:
              </h2>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Whether the model is ready to present</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Whether the model needs to be changed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>What claims you can responsibly make</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "3": {
    title: "THE FACTORY BOTTLENECK",
    index: "03",
    slides: [
      {
        id: "factory",
        label: "THE FACTORY",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              The factory has three <span className="text-[#00e5ff]">sequential production stages</span>: Stage A → Stage B → Stage C.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              Each stage can process a <span className="text-[#00e5ff] font-bold">maximum number of units per day</span>, as follows:
            </p>
            <div className="mt-2 font-mono-code text-lg border-t border-[#333] pt-2 w-full max-w-lg">
              <div className="flex justify-between text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">
                <span>Stage</span>
                <span>Maximum Processing Capacity</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span className="font-bold">Stage A</span>
                <span className="text-[#00e5ff] font-bold">1,200 units/day</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span className="font-bold">Stage B</span>
                <span className="text-[#00e5ff] font-bold">1,000 units/day</span>
              </div>
              <div className="flex justify-between text-white py-2 mt-1">
                <span className="font-bold">Stage C</span>
                <span className="text-[#00e5ff] font-bold">1,100 units/day</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "order",
        label: "THE ORDER",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-8 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              A customer has ordered <span className="text-[#00e5ff]">2800 finished units</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4 leading-relaxed">
              The order must be delivered in <span className="text-[#00e5ff] font-bold">3 days</span>. The factory:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Cannot add workers</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Cannot add machines</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Can store unfinished units between production stages</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Cannot store units outside the factory</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create a production plan that delivers the complete order within 3 days.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Explain:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>How many units each stage should produce each day</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Where unfinished units should be stored</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>How the bottleneck should be managed</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE FACTORY</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                The factory has three <span className="text-[#00e5ff]">sequential production stages</span>: Stage A → Stage B → Stage C.
              </h2>
              <p className="text-sm text-gray-300 font-mono-code mt-2 mb-1">
                Each stage can process a <span className="text-[#00e5ff] font-bold">maximum number of units per day</span>, as follows:
              </p>
              <div className="font-mono-code text-xs border-t border-[#333] pt-2 w-full">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">
                  <span>Stage</span>
                  <span>Maximum Processing Capacity</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1.5">
                  <span className="font-bold">Stage A</span>
                  <span className="text-[#00e5ff] font-bold">1,200 units/day</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1.5">
                  <span className="font-bold">Stage B</span>
                  <span className="text-[#00e5ff] font-bold">1,000 units/day</span>
                </div>
                <div className="flex justify-between text-white py-1.5 mt-0.5">
                  <span className="font-bold">Stage C</span>
                  <span className="text-[#00e5ff] font-bold">1,100 units/day</span>
                </div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE ORDER</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                A customer has ordered <span className="text-[#00e5ff]">2800 finished units</span>.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                The order must be delivered in <span className="text-[#00e5ff] font-bold">3 days</span>. The factory:
              </p>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Cannot add workers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Cannot add machines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Can store unfinished units between production stages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Cannot store units outside the factory</span>
                </div>
              </div>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Create a production plan that delivers the complete order within 3 days.
              </h2>
              <p className="text-sm text-gray-300 font-mono-code mt-2">
                Explain:
              </p>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>How many units each stage should produce each day</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Where unfinished units should be stored</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>How the bottleneck should be managed</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "4": {
    title: "THE EMERGENCY ROOM",
    index: "04",
    slides: [
      {
        id: "clinic",
        label: "THE CLINIC",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              A small emergency clinic has:
            </h1>
            <div className="flex gap-4 md:gap-8 mt-2">
              <div className="flex flex-col border-r border-[#333] pr-4 md:pr-8">
                <span className="text-5xl md:text-6xl font-bold text-white font-heading">1</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Doctor</span>
              </div>
              <div className="flex flex-col border-r border-[#333] pr-4 md:pr-8">
                <span className="text-5xl md:text-6xl font-bold text-white font-heading">1</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Nurse</span>
              </div>
              <div className="flex flex-col border-r border-[#333] pr-4 md:pr-8">
                <span className="text-5xl md:text-6xl font-bold text-white font-heading">1</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Oxygen Cylinder</span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl md:text-6xl font-bold text-white font-heading">1</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Ambulance</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4 leading-relaxed">
              The ambulance can transport <span className="text-[#00e5ff] font-bold">only one patient</span> per trip. The hospital is <span className="text-[#00e5ff] font-bold">20 minutes</span> away. Three patients arrive simultaneously.
            </p>
          </div>
        )
      },
      {
        id: "patients",
        label: "THE PATIENTS",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex flex-col gap-6 font-mono-code text-lg">
              <div className="flex gap-6 items-start">
                <span className="text-[#b300ff] font-bold text-2xl">A</span>
                <span className="text-white">Severe injury. Currently stable. Requires surgery within <span className="text-[#00e5ff] font-bold">60 minutes</span>.</span>
              </div>
              <div className="flex gap-6 items-start">
                <span className="text-[#b300ff] font-bold text-2xl">B</span>
                <span className="text-white">Severe breathing difficulty. Requires continuous oxygen. Without oxygen, condition becomes critical within <span className="text-[#00e5ff] font-bold">15 minutes</span>.</span>
              </div>
              <div className="flex gap-6 items-start">
                <span className="text-[#b300ff] font-bold text-2xl">C</span>
                <span className="text-white">Minor injury. Requires transportation to another hospital. Can safely wait <span className="text-[#00e5ff] font-bold">90 minutes</span>.</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              There is <span className="text-[#00e5ff] font-bold">no additional oxygen cylinder</span> available.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Decide:
            </h1>
            <div className="flex flex-col gap-4 mt-4 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Who receives oxygen?</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Who receives the ambulance?</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>How the doctor and nurse are allocated</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>What happens to the remaining patients</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE CLINIC</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                A small emergency clinic has:
              </h2>
              <div className="flex gap-3 md:gap-4 mt-1">
                <div className="flex flex-col border-r border-[#333] pr-3 md:pr-4">
                  <span className="text-3xl md:text-4xl font-bold text-white font-heading">1</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Doctor</span>
                </div>
                <div className="flex flex-col border-r border-[#333] pr-3 md:pr-4">
                  <span className="text-3xl md:text-4xl font-bold text-white font-heading">1</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Nurse</span>
                </div>
                <div className="flex flex-col border-r border-[#333] pr-3 md:pr-4">
                  <span className="text-3xl md:text-4xl font-bold text-white font-heading">1</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Oxygen Cylinder</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-white font-heading">1</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Ambulance</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                The ambulance can transport <span className="text-[#00e5ff] font-bold">only one patient</span> per trip. The hospital is <span className="text-[#00e5ff] font-bold">20 minutes</span> away. Three patients arrive simultaneously.
              </p>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE PATIENTS</span>
              </div>
              <div className="flex flex-col gap-4 font-mono-code text-sm">
                <div className="flex gap-3 items-start">
                  <span className="text-[#b300ff] font-bold">A</span>
                  <span className="text-white leading-snug">Severe injury. Currently stable. Requires surgery within <span className="text-[#00e5ff] font-bold">60 minutes</span>.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#b300ff] font-bold">B</span>
                  <span className="text-white leading-snug">Severe breathing difficulty. Requires continuous oxygen. Without oxygen, condition becomes critical within <span className="text-[#00e5ff] font-bold">15 minutes</span>.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#b300ff] font-bold">C</span>
                  <span className="text-white leading-snug">Minor injury. Requires transportation to another hospital. Can safely wait <span className="text-[#00e5ff] font-bold">90 minutes</span>.</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                There is <span className="text-[#00e5ff] font-bold">no additional oxygen cylinder</span> available.
              </p>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Decide:
              </h2>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Who receives oxygen?</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>Who receives the ambulance?</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>How the doctor and nurse are allocated</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>What happens to the remaining patients</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "5": {
    title: "THE HACKATHON TRIAGE",
    index: "05",
    slides: [
      {
        id: "situation",
        label: "THE SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your team has <span className="text-[#00e5ff]">18 hours</span> remaining in a hackathon.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              Your current project has:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>A working core prototype</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>A weak UI</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>A partially working backend</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>One major unfinished feature</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>No finalized demonstration flow</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "criteria",
        label: "THE CRITERIA",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              The published judging criteria are:
            </h1>
            <div className="mt-2 font-mono-code text-lg border-t border-[#333] pt-2 w-full max-w-lg">
              <div className="flex justify-between text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">
                <span>Criterion</span>
                <span>Weight</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span className="font-bold">Functionality</span>
                <span className="text-[#00e5ff] font-bold">40%</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span className="font-bold">UX</span>
                <span className="text-[#00e5ff] font-bold">30%</span>
              </div>
              <div className="flex justify-between text-white py-2 mt-1">
                <span className="font-bold">Feature completeness</span>
                <span className="text-[#00e5ff] font-bold">30%</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4 leading-relaxed">
              You have enough time to fully complete <span className="text-[#00e5ff] font-bold">only two</span> of the following:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-2 font-mono-code text-lg text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <span className="text-[#b300ff] font-bold">1</span>
                <span>Improve the UI</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#b300ff] font-bold">2</span>
                <span>Complete the backend</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#b300ff] font-bold">3</span>
                <span>Finish the major feature</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#b300ff] font-bold">4</span>
                <span>Build a polished demo flow</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Choose the <span className="text-white">two areas</span> you will prioritize and explain why.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Your team has <span className="text-[#00e5ff]">18 hours</span> remaining in a hackathon.
              </h2>
              <p className="text-sm text-gray-300 font-mono-code mt-2">
                Your current project has:
              </p>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>A working core prototype</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>A weak UI</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>A partially working backend</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>One major unfinished feature</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff]"></div>
                  <span>No finalized demonstration flow</span>
                </div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE CRITERIA</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                The published judging criteria are:
              </h2>
              <div className="font-mono-code text-xs border-t border-[#333] pt-2 w-full mt-1">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">
                  <span>Criterion</span>
                  <span>Weight</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1.5">
                  <span className="font-bold">Functionality</span>
                  <span className="text-[#00e5ff] font-bold">40%</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1.5">
                  <span className="font-bold">UX</span>
                  <span className="text-[#00e5ff] font-bold">30%</span>
                </div>
                <div className="flex justify-between text-white py-1.5 mt-0.5">
                  <span className="font-bold">Feature completeness</span>
                  <span className="text-[#00e5ff] font-bold">30%</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                You have enough time to fully complete <span className="text-[#00e5ff] font-bold">only two</span> of the following:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-1 font-mono-code text-[13px] text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#b300ff] font-bold">1</span>
                  <span>Improve the UI</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#b300ff] font-bold">2</span>
                  <span>Complete the backend</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#b300ff] font-bold">3</span>
                  <span>Finish the major feature</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#b300ff] font-bold">4</span>
                  <span>Build a polished demo flow</span>
                </div>
              </div>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Choose the two areas you will prioritize and explain why.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "6": {
    title: "THE DELIVERY LOGIC",
    index: "06",
    slides: [
      {
        id: "orders",
        label: "THE ORDERS",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You manage deliveries from a warehouse.
              <br />
              It is <span className="text-[#00e5ff]">4:00 PM</span>. You have <span className="text-[#00e5ff]">one vehicle</span>.
            </h1>
            <div className="flex flex-col md:flex-row gap-8 mt-4 border-l border-[#b300ff] pl-4">
              <div className="flex-1">
                <div className="text-xs text-[#b300ff] font-bold tracking-widest uppercase mb-2">Customer A</div>
                <div className="flex flex-col gap-2 font-mono-code text-lg text-white">
                  <div>Needs <span className="text-[#00e5ff] font-bold">3 medical devices</span></div>
                  <div>Deadline: <span className="text-[#00e5ff] font-bold">5:30 PM</span></div>
                  <div>Travel time from warehouse: <span className="text-[#00e5ff] font-bold">30 minutes</span></div>
                </div>
              </div>
              <div className="hidden md:block w-[1px] bg-[#333]"></div>
              <div className="flex-1 border-l border-[#b300ff] md:border-none pl-4 md:pl-0">
                <div className="text-xs text-[#b300ff] font-bold tracking-widest uppercase mb-2">Customer B</div>
                <div className="flex flex-col gap-2 font-mono-code text-lg text-white">
                  <div>Needs <span className="text-[#00e5ff] font-bold">1 emergency medical device</span></div>
                  <div>Deadline: <span className="text-[#00e5ff] font-bold">6:00 PM</span></div>
                  <div>Travel time from warehouse: <span className="text-[#00e5ff] font-bold">20 minutes</span></div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "vehicle",
        label: "THE VEHICLE",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              The vehicle:
            </h1>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Can carry only one customer's complete order at a time</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Must return to the warehouse before taking another order</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Takes the same amount of time returning as going</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Loading each order takes <span className="text-[#00e5ff] font-bold">5 minutes</span></span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create a delivery sequence that gets both orders delivered before their deadlines.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Explain why your sequence is preferable to the alternative.
            </p>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE ORDERS</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                You manage deliveries from a warehouse. It is <span className="text-[#00e5ff]">4:00 PM</span>. You have <span className="text-[#00e5ff]">one vehicle</span>.
              </h2>
              <div className="flex flex-col gap-4 mt-2">
                <div className="border-l border-[#b300ff] pl-3">
                  <div className="text-[10px] text-[#b300ff] font-bold tracking-widest uppercase mb-1">Customer A</div>
                  <div className="flex flex-col gap-1 font-mono-code text-xs text-white">
                    <div>Needs <span className="text-[#00e5ff] font-bold">3 medical devices</span></div>
                    <div>Deadline: <span className="text-[#00e5ff] font-bold">5:30 PM</span></div>
                    <div>Travel time from warehouse: <span className="text-[#00e5ff] font-bold">30 minutes</span></div>
                  </div>
                </div>
                <div className="border-l border-[#b300ff] pl-3">
                  <div className="text-[10px] text-[#b300ff] font-bold tracking-widest uppercase mb-1">Customer B</div>
                  <div className="flex flex-col gap-1 font-mono-code text-xs text-white">
                    <div>Needs <span className="text-[#00e5ff] font-bold">1 emergency medical device</span></div>
                    <div>Deadline: <span className="text-[#00e5ff] font-bold">6:00 PM</span></div>
                    <div>Travel time from warehouse: <span className="text-[#00e5ff] font-bold">20 minutes</span></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE VEHICLE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                The vehicle:
              </h2>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Can carry only one customer's complete order at a time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Must return to the warehouse before taking another order</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Takes the same amount of time returning as going</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Loading each order takes <span className="text-[#00e5ff] font-bold">5 minutes</span></span>
                </div>
              </div>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Create a delivery sequence that gets both orders delivered before their deadlines.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                Explain why your sequence is preferable to the alternative.
              </p>
            </div>
          </div>
        )
      }
    ]
  },
  "7": {
    title: "THE INTERNSHIP DECISION",
    index: "07",
    slides: [
      {
        id: "offers",
        label: "THE OFFERS",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-5xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You are a college student looking for an internship. You have received two offers.
            </h1>
            <div className="flex flex-col md:flex-row gap-8 mt-4 border-l border-[#b300ff] pl-4">
              <div className="flex-1">
                <div className="text-xs text-[#b300ff] font-bold tracking-widest uppercase mb-4">Offer A - High Pay</div>
                <div className="flex flex-col gap-2 font-mono-code text-lg text-white">
                  <div className="text-[#00e5ff] font-bold text-2xl mb-1">₹40,000/month</div>
                  <div><span className="text-[#00e5ff] font-bold">3-month</span> internship</div>
                  <div><span className="text-[#00e5ff] font-bold">40 hours/week</span></div>
                  <div className="mt-2">Work primarily involves <span className="text-[#00e5ff] font-bold">routine implementation tasks</span></div>
                  <div>Work follows instructions from senior developers</div>
                  <div>Limited exposure to system design and technical decision-making</div>
                  <div>Completion certificate provided</div>
                  <div>Company is well known in the industry</div>
                </div>
              </div>
              <div className="hidden md:block w-[1px] bg-[#333]"></div>
              <div className="flex-1 border-l border-[#b300ff] md:border-none pl-4 md:pl-0">
                <div className="text-xs text-[#b300ff] font-bold tracking-widest uppercase mb-4">Offer B - High Learning</div>
                <div className="flex flex-col gap-2 font-mono-code text-lg text-white">
                  <div className="text-[#00e5ff] font-bold text-2xl mb-1">₹10,000/month</div>
                  <div><span className="text-[#00e5ff] font-bold">6-month</span> internship</div>
                  <div><span className="text-[#00e5ff] font-bold">30 hours/week</span></div>
                  <div className="mt-2">Work directly with a small engineering team</div>
                  <div>Design and implement features yourself</div>
                  <div>Participate in code reviews and technical discussions</div>
                  <div>Work on a real production system</div>
                  <div>Regular mentorship from a senior engineer</div>
                  <div>Company is relatively unknown</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "situation",
        label: "YOUR SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You can accept <span className="text-[#00e5ff]">only one</span> offer.
            </h1>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>You do <span className="text-[#00e5ff] font-bold">not</span> know whether either company will offer you a full-time position after the internship</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>You do <span className="text-[#00e5ff] font-bold">not</span> have a financial emergency that requires you to choose the higher-paying option</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Choose <span className="text-[#00e5ff]">one</span> offer.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Explain:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Which offer you choose</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Why you chose it</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>What you gain from your decision</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>What you give up</span>
              </div>
              <div className="flex items-center gap-4 col-span-1 md:col-span-2">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>What your decision is ultimately optimizing for</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[95vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-[2] flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE OFFERS</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                You are a college student looking for an internship. You have received two offers.
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 mt-2 border-l border-[#b300ff] pl-3">
                <div className="flex-1">
                  <div className="text-[10px] text-[#b300ff] font-bold tracking-widest uppercase mb-2">Offer A - High Pay</div>
                  <div className="flex flex-col gap-1 font-mono-code text-xs text-white">
                    <div className="text-[#00e5ff] font-bold text-sm mb-1">₹40,000/month</div>
                    <div><span className="text-[#00e5ff] font-bold">3-month</span> internship</div>
                    <div><span className="text-[#00e5ff] font-bold">40 hours/week</span></div>
                    <div className="mt-1">Work primarily involves <span className="text-[#00e5ff] font-bold">routine implementation tasks</span></div>
                    <div>Work follows instructions from senior developers</div>
                    <div>Limited exposure to system design and technical decision-making</div>
                    <div>Completion certificate provided</div>
                    <div>Company is well known in the industry</div>
                  </div>
                </div>
                <div className="hidden lg:block w-[1px] bg-[#333]"></div>
                <div className="flex-1 border-l border-[#b300ff] lg:border-none pl-3 lg:pl-0">
                  <div className="text-[10px] text-[#b300ff] font-bold tracking-widest uppercase mb-2">Offer B - High Learning</div>
                  <div className="flex flex-col gap-1 font-mono-code text-xs text-white">
                    <div className="text-[#00e5ff] font-bold text-sm mb-1">₹10,000/month</div>
                    <div><span className="text-[#00e5ff] font-bold">6-month</span> internship</div>
                    <div><span className="text-[#00e5ff] font-bold">30 hours/week</span></div>
                    <div className="mt-1">Work directly with a small engineering team</div>
                    <div>Design and implement features yourself</div>
                    <div>Participate in code reviews and technical discussions</div>
                    <div>Work on a real production system</div>
                    <div>Regular mentorship from a senior engineer</div>
                    <div>Company is relatively unknown</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">YOUR SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                You can accept <span className="text-[#00e5ff]">only one</span> offer.
              </h2>
              <div className="flex flex-col gap-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>You do <span className="text-[#00e5ff] font-bold">not</span> know whether either company will offer you a full-time position after the internship</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>You do <span className="text-[#00e5ff] font-bold">not</span> have a financial emergency that requires you to choose the higher-paying option</span>
                </div>
              </div>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Choose <span className="text-[#00e5ff]">one</span> offer.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-1">
                Explain:
              </p>
              <div className="grid grid-cols-1 gap-y-3 mt-1 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Which offer you choose</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Why you chose it</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>What you gain from your decision</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>What you give up</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span className="leading-tight">What your decision is ultimately optimizing for</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "8": {
    title: "THE ANOMALY",
    index: "08",
    slides: [
      {
        id: "situation",
        label: "THE SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your team is conducting an experiment for a college project.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-2">
              You have <span className="text-[#00e5ff] font-bold">one day remaining</span> before your final submission.
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-bold text-[#00e5ff] font-heading">7</span>
                <span className="text-xs md:text-sm text-gray-300 font-bold tracking-widest uppercase mt-2">Successful</span>
              </div>
              <span className="text-xl md:text-2xl text-gray-500 font-mono-code px-4">VS</span>
              <div className="flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-bold text-[#b300ff] font-heading">1</span>
                <span className="text-xs md:text-sm text-gray-300 font-bold tracking-widest uppercase mt-2">Failed</span>
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-400 font-mono-code mt-4">
              Your first <span className="text-[#00e5ff] font-bold">8 trials</span> produced 7 successful results and 1 failed result.
            </p>
          </div>
        )
      },
      {
        id: "conditions",
        label: "THE CONDITIONS",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              The seven successful trials were conducted under the same controlled laboratory conditions.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              The failed trial was conducted under the same procedure.
            </p>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              Your team currently believes the failure was an <span className="text-[#00e5ff] font-bold">anomaly</span>.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Decide what you will do:
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Continue collecting data</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Repeat the experiment</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Remove the failed result</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Present the existing results</span>
              </div>
              <div className="flex items-center gap-4 col-span-1 md:col-span-2">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>Change the experimental approach</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-6">
              Explain your reasoning.
            </p>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Your team is conducting an experiment for a college project.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                You have <span className="text-[#00e5ff] font-bold">one day remaining</span> before your final submission.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-[#00e5ff] font-heading">7</span>
                  <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase mt-1">Successful</span>
                </div>
                <span className="text-sm text-gray-500 font-mono-code px-2">VS</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-[#b300ff] font-heading">1</span>
                  <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase mt-1">Failed</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                Your first <span className="text-[#00e5ff] font-bold">8 trials</span> produced 7 successful results and 1 failed result.
              </p>
            </div>
            
            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE CONDITIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                The seven successful trials were conducted under the same controlled laboratory conditions.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-2">
                The failed trial was conducted under the same procedure.
              </p>
              <p className="text-sm text-gray-300 font-mono-code mt-2">
                Your team currently believes the failure was an <span className="text-[#00e5ff] font-bold">anomaly</span>.
              </p>
            </div>
    
            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Decide what you will do:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-2 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Continue collecting data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Repeat the experiment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Remove the failed result</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Present the existing results</span>
                </div>
                <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Change the experimental approach</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-mono-code mt-4">
                Explain your reasoning.
              </p>
            </div>
          </div>
        )
      }
    ]
  },
  "9": {
    title: "THE EXAM STRATEGY",
    index: "09",
    slides: [
      {
        id: "situation",
        label: "THE SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You have an exam tomorrow at <span className="text-[#00e5ff]">10:00 AM</span>.
              <br />
              There are <span className="text-[#00e5ff]">10 topics</span>, studied in four ranges.
            </h1>
            <div className="mt-4 font-mono-code text-lg border-t border-[#333] pt-2 w-full">
              <div className="grid grid-cols-4 gap-4 text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mb-4 text-center">
                <div className="text-left">Topics</div>
                <div>Expected Marks</div>
                <div>Current Preparation</div>
                <div className="text-[#b300ff]">Time to Fully Prepare</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-white border-b border-[#333] py-3 text-center items-center">
                <div className="text-left font-bold">1-3</div>
                <div className="text-[#00e5ff] font-bold">20</div>
                <div className="text-[#00e5ff] font-bold">80%</div>
                <div className="text-[#b300ff] font-bold">5 HRS</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-white border-b border-[#333] py-3 text-center items-center">
                <div className="text-left font-bold">4-6</div>
                <div className="text-[#00e5ff] font-bold">30</div>
                <div className="text-[#00e5ff] font-bold">40%</div>
                <div className="text-[#b300ff] font-bold">5 HRS</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-white border-b border-[#333] py-3 text-center items-center">
                <div className="text-left font-bold">7-8</div>
                <div className="text-[#00e5ff] font-bold">30</div>
                <div className="text-[#00e5ff] font-bold">20%</div>
                <div className="text-[#b300ff] font-bold">5 HRS</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-white py-3 text-center items-center">
                <div className="text-left font-bold">9-10</div>
                <div className="text-[#00e5ff] font-bold">20</div>
                <div className="text-[#00e5ff] font-bold">0%</div>
                <div className="text-[#b300ff] font-bold">4 HRS</div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "limit",
        label: "THE LIMIT",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You have <span className="text-[#00e5ff]">8 hours</span> available for studying.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              You cannot study all topics thoroughly.
            </p>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4 leading-relaxed">
              "Time to fully prepare" is how long a range takes to go from 0% to 100%. Preparation grows evenly with study time.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create a study strategy that maximizes your expected exam score.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Your team must explain:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Which topics you study</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Which topics you deprioritize</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Why your strategy gives the highest expected return</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[95vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-[3] flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                You have an exam tomorrow at <span className="text-[#00e5ff]">10:00 AM</span>. There are <span className="text-[#00e5ff]">10 topics</span>, studied in four ranges.
              </h2>
              <div className="mt-2 font-mono-code text-sm border-t border-[#333] pt-2 w-full">
                <div className="grid grid-cols-4 gap-2 text-[8px] md:text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2 text-center">
                  <div className="text-left">Topics</div>
                  <div>Expected Marks</div>
                  <div>Current Prep</div>
                  <div className="text-[#b300ff]">Time to Prepare</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-white border-b border-[#333] py-2 text-center items-center text-xs">
                  <div className="text-left font-bold">1-3</div>
                  <div className="text-[#00e5ff] font-bold">20</div>
                  <div className="text-[#00e5ff] font-bold">80%</div>
                  <div className="text-[#b300ff] font-bold">5 HRS</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-white border-b border-[#333] py-2 text-center items-center text-xs">
                  <div className="text-left font-bold">4-6</div>
                  <div className="text-[#00e5ff] font-bold">30</div>
                  <div className="text-[#00e5ff] font-bold">40%</div>
                  <div className="text-[#b300ff] font-bold">5 HRS</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-white border-b border-[#333] py-2 text-center items-center text-xs">
                  <div className="text-left font-bold">7-8</div>
                  <div className="text-[#00e5ff] font-bold">30</div>
                  <div className="text-[#00e5ff] font-bold">20%</div>
                  <div className="text-[#b300ff] font-bold">5 HRS</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-white py-2 text-center items-center text-xs">
                  <div className="text-left font-bold">9-10</div>
                  <div className="text-[#00e5ff] font-bold">20</div>
                  <div className="text-[#00e5ff] font-bold">0%</div>
                  <div className="text-[#b300ff] font-bold">4 HRS</div>
                </div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex-[2] flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE LIMIT</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                You have <span className="text-[#00e5ff]">8 hours</span> available for studying.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-1">
                You cannot study all topics thoroughly.
              </p>
              <p className="text-sm text-gray-300 font-mono-code mt-2">
                "Time to fully prepare" is how long a range takes to go from 0% to 100%. Preparation grows evenly with study time.
              </p>
            </div>
    
            {/* Column 3 */}
            <div className="flex-[2] flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Create a study strategy that maximizes your expected exam score.
              </h2>
              <p className="text-sm text-gray-400 font-mono-code mt-1">
                Your team must explain:
              </p>
              <div className="flex flex-col gap-3 mt-1 font-mono-code text-sm text-white font-medium ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Which topics you study</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span>Which topics you deprioritize</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b300ff] shrink-0"></div>
                  <span className="leading-tight">Why your strategy gives the highest expected return</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "10": {
    title: "THE PHONE THAT HAS TO LAST",
    index: "10",
    slides: [
      {
        id: "situation",
        label: "THE SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You are going on a <span className="text-[#00e5ff]">7-day college trip</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              Your phone is currently at <span className="text-[#00e5ff] font-bold">100% battery</span>. You have:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>No charger</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>No power bank</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>No laptop</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>No access to an electrical outlet</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Your phone must remain usable throughout the trip.
            </p>
          </div>
        )
      },
      {
        id: "battery",
        label: "THE BATTERY",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Fixed battery consumption rates:
            </h1>
            <div className="mt-4 font-mono-code text-lg border-t border-[#333] pt-2 w-full">
              <div className="flex justify-between text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">
                <span>Activity</span>
                <span>Battery Consumption</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>1 hour video</span>
                <span className="text-[#00e5ff] font-bold">10%</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>1 hour gaming</span>
                <span className="text-[#00e5ff] font-bold">15%</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>1 hour GPS navigation</span>
                <span className="text-[#00e5ff] font-bold">8%</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>1 hour video call</span>
                <span className="text-[#00e5ff] font-bold">12%</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>1 hour messaging</span>
                <span className="text-[#00e5ff] font-bold">2%</span>
              </div>
              <div className="flex justify-between text-white py-2 mt-1">
                <span>12 hours idle with network active</span>
                <span className="text-[#00e5ff] font-bold">4%</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create a phone usage plan for the 7 days.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Explain:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Which activities are allowed and how often</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Which activities are restricted</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff] shrink-0"></div>
                <span>Expected battery remaining at the end of day 7</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[95vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                7-day trip with <span className="text-[#00e5ff]">100% battery</span> and no charger or outlet.
              </h2>
              <div className="flex flex-col gap-2 mt-2 font-mono-code text-sm text-white">
                <div>• No power bank or laptop</div>
                <div>• Must remain usable for 7 days</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE BATTERY</span>
              </div>
              <div className="font-mono-code text-xs border-t border-[#333] pt-2 w-full">
                <div className="flex justify-between text-gray-500 font-bold tracking-widest uppercase mb-1">
                  <span>Activity</span>
                  <span>Drain</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1">
                  <span>1hr video</span>
                  <span className="text-[#00e5ff] font-bold">10%</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1">
                  <span>1hr gaming</span>
                  <span className="text-[#00e5ff] font-bold">15%</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1">
                  <span>1hr GPS</span>
                  <span className="text-[#00e5ff] font-bold">8%</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1">
                  <span>1hr video call</span>
                  <span className="text-[#00e5ff] font-bold">12%</span>
                </div>
                <div className="flex justify-between text-white border-b border-[#333] py-1">
                  <span>1hr messaging</span>
                  <span className="text-[#00e5ff] font-bold">2%</span>
                </div>
                <div className="flex justify-between text-white py-1">
                  <span>12hr idle</span>
                  <span className="text-[#00e5ff] font-bold">4%</span>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Create a 7-day usage plan.
              </h2>
              <div className="flex flex-col gap-2 mt-2 font-mono-code text-sm text-white ml-2">
                <div>• Allowed activities</div>
                <div>• Restricted activities</div>
                <div>• Remaining battery estimation</div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "11": {
    title: "THE EVENT THAT IS TOO SUCCESSFUL",
    index: "11",
    slides: [
      {
        id: "workshop",
        label: "THE WORKSHOP",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your college club is organizing a <span className="text-[#00e5ff]">2-hour technical workshop</span> for <span className="text-[#00e5ff]">100 registered students</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              You have:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 font-mono-code text-xl text-white font-medium">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>1 venue (max 120 cap)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>100 chairs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>5 volunteers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>1 speaker</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>1 projector</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>1 microphone</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "rules",
        label: "THE RULES",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Schedule & Rules:
            </h1>
            <div className="flex flex-col gap-3 font-mono-code text-xl text-white">
              <div><span className="text-[#00e5ff] font-bold">20 min</span> — Intro</div>
              <div><span className="text-[#00e5ff] font-bold">60 min</span> — Workshop</div>
              <div><span className="text-[#00e5ff] font-bold">40 min</span> — Hands-on</div>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Strict Rules:
            </p>
            <div className="flex flex-col gap-3 font-mono-code text-lg text-gray-300 ml-4">
              <div>• Nobody may stand during the workshop</div>
              <div>• Venue cannot exceed 120 people</div>
              <div>• Must happen in given venue (no online / extra equipment)</div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create an execution plan if <span className="text-[#00e5ff]">150 students</span> show up.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Explain:
            </p>
            <div className="flex flex-col gap-4 mt-2 font-mono-code text-xl text-white font-medium ml-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>How entry is managed</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>How seating is handled</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#b300ff]"></div>
                <span>How volunteers are assigned</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[95vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE WORKSHOP</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                2-hour workshop for <span className="text-[#00e5ff]">100 registered students</span>.
              </h2>
              <div className="flex flex-col gap-2 mt-2 font-mono-code text-xs text-white">
                <div>• Venue cap: 120</div>
                <div>• Chairs: 100</div>
                <div>• Volunteers: 5</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE RULES</span>
              </div>
              <div className="flex flex-col gap-2 font-mono-code text-xs text-gray-300">
                <div>• 20m intro, 60m main, 40m hands-on</div>
                <div>• Nobody may stand</div>
                <div>• Venue limit strictly 120</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Plan for <span className="text-[#00e5ff]">150 students</span> arriving.
              </h2>
              <div className="flex flex-col gap-2 mt-2 font-mono-code text-xs text-white ml-2">
                <div>• Entry management</div>
                <div>• Seating capacity</div>
                <div>• Volunteer roles</div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  "12": {
    title: "THE LAST TEN MINUTES",
    index: "12",
    slides: [
      {
        id: "situation",
        label: "THE SITUATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your team is participating in a competition.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              You have <span className="text-[#00e5ff] font-bold">10 minutes remaining</span>.
            </p>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code">
              Your project is <span className="text-[#00e5ff] font-bold">80% complete</span>.
            </p>
          </div>
        )
      },
      {
        id: "options",
        label: "THE OPTIONS",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-5xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You have two choices:
            </h1>
            <div className="flex flex-col md:flex-row gap-8 mt-4 border-l border-[#b300ff] pl-4">
              <div className="flex-1">
                <div className="text-xs text-[#b300ff] font-bold tracking-widest uppercase mb-4">Option A — Submit Now</div>
                <div className="flex flex-col gap-2 font-mono-code text-lg text-white">
                  <div>• Existing system is stable</div>
                  <div>• One major feature incomplete</div>
                  <div>• Already tested</div>
                </div>
              </div>
              <div className="hidden md:block w-[1px] bg-[#333]"></div>
              <div className="flex-1 border-l border-[#b300ff] md:border-none pl-4 md:pl-0">
                <div className="text-xs text-[#b300ff] font-bold tracking-widest uppercase mb-4">Option B — Final Feature</div>
                <div className="flex flex-col gap-2 font-mono-code text-lg text-white">
                  <div>• Substantially improves project</div>
                  <div>• May break existing system</div>
                  <div>• Only 10 mins to implement & test</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Choose Option A or Option B and justify your choice under time pressure.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[95vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE SITUATION</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                <span className="text-[#00e5ff]">10 minutes</span> left, project <span className="text-[#00e5ff]">80% complete</span>.
              </h2>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE OPTIONS</span>
              </div>
              <div className="flex flex-col gap-3 font-mono-code text-xs text-white">
                <div><b className="text-[#b300ff]">A:</b> Submit safe 80% project now</div>
                <div><b className="text-[#b300ff]">B:</b> Risk breaking it for 100%</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Choose A or B and defend your choice.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "13": {
    title: "THE BRIDGE",
    index: "13",
    slides: [
      {
        id: "bridge",
        label: "THE BRIDGE",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              A temporary bridge connects two parts of a construction site.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-mono-code mt-4">
              The bridge has a <span className="text-[#00e5ff] font-bold">maximum safe load of 10 tonnes</span> at any given time.
            </p>
          </div>
        )
      },
      {
        id: "vehicles",
        label: "THE VEHICLES",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Five vehicles are waiting to cross:
            </h1>
            <div className="mt-2 font-mono-code text-lg border-t border-[#333] pt-2 w-full max-w-md">
              <div className="flex justify-between text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">
                <span>Vehicle</span>
                <span>Weight</span>
                <span>Count</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>Car</span>
                <span className="text-[#00e5ff] font-bold">2 tonnes</span>
                <span className="text-[#b300ff] font-bold">2</span>
              </div>
              <div className="flex justify-between text-white border-b border-[#333] py-2">
                <span>Delivery Van</span>
                <span className="text-[#00e5ff] font-bold">4 tonnes</span>
                <span className="text-[#b300ff] font-bold">2</span>
              </div>
              <div className="flex justify-between text-white py-2 mt-1">
                <span>Truck</span>
                <span className="text-[#00e5ff] font-bold">7 tonnes</span>
                <span className="text-[#b300ff] font-bold">1</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Determine the crossing sequence for all 5 vehicles.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Ensure total weight on the bridge never exceeds <span className="text-[#00e5ff] font-bold">10 tonnes</span>.
            </p>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE BRIDGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Max load: <span className="text-[#00e5ff]">10 tonnes</span>.
              </h2>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">VEHICLES</span>
              </div>
              <div className="flex flex-col gap-2 font-mono-code text-xs text-white">
                <div>• 2 Cars (2t each)</div>
                <div>• 2 Vans (4t each)</div>
                <div>• 1 Truck (7t)</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">THE CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Sequence the 5 vehicles safely.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "14": {
    title: "THE COMPUTER LAB",
    index: "14",
    slides: [
      {
        id: "lab",
        label: "THE LAB",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your college is conducting an important practical examination in a computer lab.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              There are <span className="text-[#00e5ff] font-bold">30 students</span> and <span className="text-[#00e5ff] font-bold">30 computers</span>. The exam begins in <span className="text-[#00e5ff] font-bold">20 minutes</span>.
            </p>
          </div>
        )
      },
      {
        id: "preparation",
        label: "THE PREPARATION",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Before the exam starts, you must prepare the lab.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Each computer must be switched on, connected to network, software checked. You have <span className="text-[#00e5ff] font-bold">3 volunteers</span>.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create a plan to prepare the lab within 20 minutes.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE LAB</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                30 students, 30 computers, 20 mins till exam.
              </h2>
            </div>
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">PREPARATION</span>
              </div>
              <p className="text-sm text-gray-300 font-mono-code">
                Switch on, network check, software verify with 3 volunteers.
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Complete lab setup in 20 minutes.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "15": {
    title: "THE SPEAKER WHO CANNOT SPEAK",
    index: "15",
    slides: [
      {
        id: "workshop",
        label: "THE WORKSHOP",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Your college club is conducting a <span className="text-[#00e5ff]">60-minute workshop</span> for <span className="text-[#00e5ff]">80 students</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Schedule: 15m Intro, 30m Main Demo, 15m Hands-on activity.
            </p>
          </div>
        )
      },
      {
        id: "resources",
        label: "THE RESOURCES",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Available resources:
            </h1>
            <div className="flex flex-col gap-3 font-mono-code text-xl text-white">
              <div>• 1 main speaker (only person who knows complete demo)</div>
              <div>• 2 volunteers, 1 laptop, 1 projector</div>
              <div>• Workshop starts in 20 minutes</div>
            </div>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Create an execution plan so the workshop can run if a problem occurs with the main speaker.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE WORKSHOP</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                60-min workshop for 80 students.
              </h2>
            </div>
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">RESOURCES</span>
              </div>
              <p className="text-sm text-gray-300 font-mono-code">
                1 main speaker, 2 volunteers, 1 laptop, 1 projector.
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Contingency plan if speaker cannot speak.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "16": {
    title: "THE FACTORY FIRE",
    index: "16",
    slides: [
      {
        id: "factory",
        label: "THE FACTORY",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              A factory runs <span className="text-[#00e5ff]">24 hours a day</span> with <span className="text-[#00e5ff]">2 production lines</span> of hot moulding machines.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Normal operation produces temp fluctuations, smoke, air pressure changes.
            </p>
          </div>
        )
      },
      {
        id: "goal",
        label: "THE GOAL",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Detect danger <span className="text-[#00e5ff]">at least 5 minutes before a fire starts</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Budget: <span className="text-[#00e5ff] font-bold">₹2,00,000</span>.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Design a fire-detection system within budget.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">FACTORY</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                2 production lines operating 24/7.
              </h2>
            </div>
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">GOAL</span>
              </div>
              <p className="text-sm text-gray-300 font-mono-code">
                Detect fire 5 mins early with ₹2,00,000 budget.
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Design system within budget.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "17": {
    title: "THE DOOR THAT SHOULD STAY CLOSED",
    index: "17",
    slides: [
      {
        id: "doors",
        label: "THE DOORS",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You are <span className="text-[#00e5ff]">trapped inside a building</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Three doors: Door A ("SAFETY"), Door B ("EXIT"), Door C (no label).
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Choose which door your team will take and explain why.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE DOORS</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Trapped inside, 3 choices: A, B, or C.
              </h2>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Choose one door and explain reasoning.
              </h2>
            </div>
          </div>
        )
      }
    ]
  },
  "18": {
    title: "THE BOX NOBODY SHOULD OPEN",
    index: "18",
    slides: [
      {
        id: "boxes",
        label: "THE BOXES",
        labelColor: "text-[#00e5ff]",
        borderColor: "border-[#00e5ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              You are <span className="text-[#00e5ff]">stranded in an isolated location</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-mono-code mt-4">
              Five sealed boxes (A, B, C, D, E). You can carry <span className="text-[#00e5ff] font-bold">only two</span>.
            </p>
          </div>
        )
      },
      {
        id: "challenge",
        label: "THE CHALLENGE",
        labelColor: "text-[#b300ff]",
        borderColor: "border-[#b300ff]",
        content: (
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Choose the two boxes you would carry.
            </h1>
          </div>
        )
      },
      {
        id: "overview",
        label: "",
        labelColor: "hidden",
        borderColor: "hidden",
        content: (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-[90vw] mx-auto scale-90 md:scale-100 origin-top md:origin-center -mt-8 h-[65vh] md:h-auto overflow-y-auto md:overflow-visible custom-scrollbar pb-12 md:pb-0 pr-4 md:pr-0">
            <div className="flex-1 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#00e5ff]/20 pb-8 md:pb-0 pr-0 md:pr-8">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#00e5ff]"></div>
                <span className="text-[#00e5ff]">THE BOXES</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                5 sealed boxes, pick only 2.
              </h2>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2 font-mono-code font-bold tracking-widest uppercase text-xs">
                <div className="w-6 h-[2px] bg-[#b300ff]"></div>
                <span className="text-[#b300ff]">CHALLENGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight font-heading">
                Explain which 2 boxes and why.
              </h2>
            </div>
          </div>
        )
      }
    ]
  }
};

export default function ProblemStatementPage() {
  const params = useParams();
  const id = params?.id as string || "1";
  const ps = psData[id] || psData["1"];
  const slides = ps.slides;
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        router.push("/events/point-break/register?showPS=true");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, router]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden flex flex-col relative selection:bg-[#b300ff] selection:text-white">
      {/* Background radial gradient */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-tr from-[#b300ff]/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center p-8 relative z-20">
        <div className="flex items-center gap-4 font-mono-code font-bold tracking-widest text-sm md:text-base min-w-0">
          <span className="text-[#b300ff] shrink-0">{ps.index}</span>
          <span className="text-white uppercase truncate">{ps.title}</span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.push("/events/point-break/register?showPS=true")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-8 md:px-24 relative z-10 w-full max-w-7xl mx-auto">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full absolute left-0 px-8 md:px-24"
          >
            <div className="flex items-center gap-4 mb-8 font-mono-code font-bold tracking-widest uppercase text-sm">
              <div className={`w-8 h-[2px] ${slides[currentSlide].borderColor}`}></div>
              <span className={slides[currentSlide].labelColor}>{slides[currentSlide].label}</span>
            </div>
            {slides[currentSlide].content}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Keyboard Controls Hint & Dots */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center items-center gap-12 z-20">
        <button 
          onClick={prevSlide}
          className={`p-2 rounded-full transition-colors ${currentSlide === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div className="flex gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'bg-gray-700 hover:bg-gray-500'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className={`p-2 rounded-full transition-colors ${currentSlide === slides.length - 1 ? 'text-gray-700 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
      
      {/* Tiny keyboard hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-600 font-mono-code text-xs uppercase tracking-widest">
        Use keyboard arrows to navigate
      </div>
    </div>
  );
}
