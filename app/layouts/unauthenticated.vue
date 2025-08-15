<template>
    <div class="p-5 h-[100svh] font-primary">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
        <div class="p-5 rounded-lg  flex flex-col justify-center items-center h-full overflow-hidden bg-[url('https://images.unsplash.com/photo-1669225088085-d16de8d8bf61')] bg-cover relative bg-center">

          <div class="p-5 bg-white rounded-lg absolute bottom-5 left-5 space-y-2">
           <h2 class="text-4xl font-normal text-gray-900 leading-none">Clutch</h2>
           <p class="text-gray-500 text-sm">A tool to manage your freelancing projects, tasks and team</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-lg flex flex-col justify-center items-center ">
          <slot />
        </div>
      </div>
    </div>
</template>